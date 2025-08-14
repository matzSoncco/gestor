// src/utils/apiErrorHandler.ts
import type { ApiError, FieldErrors } from "@/types/errors";
import { isApiError } from "@/types/errors";
import { FIELD_NAMES_BASE } from "@/types/fieldNames";

type HandleApiErrorOptions =
  | string
  | {
      context?: string;
      fieldNames?: Record<string, string>;
    };

// Busca mensajes en estructuras anidadas usando un resolvedor de nombres
function findDeepErrorMessage(
  data: any,
  resolveName: (field: string) => string
): string | null {
  if (!data) return null;
  if (typeof data === "string") return data;

  if (Array.isArray(data)) {
    for (const item of data) {
      const found = findDeepErrorMessage(item, resolveName);
      if (found) return found;
    }
  }

  if (typeof data === "object") {
    for (const key of Object.keys(data)) {
      const found = findDeepErrorMessage((data as any)[key], resolveName);
      if (found) {
        const fieldName = resolveName(key);
        return key === "non_field_errors" ? found : `${fieldName}: ${found}`;
      }
    }
  }
  return null;
}

// Convierte errores anidados en objeto plano tipo { campo: [errores] }
function normalizeFieldErrors(errors: any, parentKey = ''): FieldErrors {
  let flat: FieldErrors = {};

  for (const key in errors) {
    const value = errors[key];
    const fullKey = parentKey ? `${parentKey}.${key}` : key;

    if (Array.isArray(value)) {
      // Caso: array de strings → error directo
      if (value.every(v => typeof v === 'string')) {
        flat[fullKey] = value;
      }
      // Caso: array de objetos → indexarlos
      else {
        value.forEach((item, index) => {
          if (typeof item === 'object' && item !== null) {
            Object.assign(flat, normalizeFieldErrors(item, `${fullKey}[${index}]`));
          }
        });
      }
    }
    else if (typeof value === 'object' && value !== null) {
      // Objeto anidado → seguir recorriendo
      Object.assign(flat, normalizeFieldErrors(value, fullKey));
    }
    else {
      // Valor simple → pasarlo a array
      flat[fullKey] = [String(value)];
    }
  }

  return flat;
}

// Nombres "bonitos" de campos, permitiendo inyectar un mapa por formulario/tipo
function getFieldDisplayName(
  field: string,
  customMap?: Record<string, string>
): string {
  const base = { ...FIELD_NAMES_BASE, ...(customMap || {}) };

  // Soporte para paths como "detalle[0].cantidad"
  if (field.includes("[") && field.includes("]")) {
    const baseField = field.split("[")[0]; // p.ej. 'mantenimiento_detalle'
    const nestedField = field.split(".").pop(); // p.ej. 'cantidad'
    const baseName = base[baseField] || baseField.replace(/_/g, " ");
    const nestedName = nestedField
      ? base[nestedField] || nestedField.replace(/_/g, " ")
      : "";
    return nestedName ? `${baseName} - ${nestedName}` : baseName;
  }

  return base[field] || field.replace(/_/g, " ");
}

function inferCodeFromStatus(status: number): string {
  switch (status) {
    case 400: return "BAD_REQUEST";
    case 401: return "UNAUTHENTICATED";
    case 403: return "FORBIDDEN";
    case 404: return "NOT_FOUND";
    case 405: return "METHOD_NOT_ALLOWED";
    case 413: return "PAYLOAD_TOO_LARGE";
    case 422: return "UNPROCESSABLE_ENTITY";
    case 429: return "TOO_MANY_REQUESTS";
    case 500: return "SERVER_ERROR";
    default: return "ERROR";
  }
}

function extractErrorMessage(
  error: any,
  fallback: string,
  resolveName: (field: string) => string
): string {
  if (!error) return fallback;
  if (typeof error === "string") return error;

  if (isApiError(error)) return error.detail;

  const responseData = error?.response?.data;
  if (responseData) {
    if (responseData.detail) return responseData.detail;

    if (responseData.errors) {
      const deepMsg = findDeepErrorMessage(responseData.errors, resolveName);
      if (deepMsg) return deepMsg;
    }

    if (typeof responseData === "object") {
      const keys = Object.keys(responseData);
      if (keys.length > 0) {
        const firstKey = keys[0];
        const firstError = Array.isArray((responseData as any)[firstKey])
          ? (responseData as any)[firstKey][0]
          : (responseData as any)[firstKey];
        const fieldName = resolveName(firstKey);
        return firstKey === "non_field_errors"
          ? String(firstError)
          : `Error en ${fieldName}: ${String(firstError)}`;
      }
    }

    if (typeof responseData === "string") return responseData;
  }

  // AxiosError sin response → red/timeout/etc.
  if (error?.message && !error?.response) {
    return `Error de conexión: ${error.message}`;
  }

  // Cualquier objeto sin response
  if (typeof error === "object" && !error?.response) {
    const keys = Object.keys(error);
    if (keys.length > 0) {
      const firstKey = keys[0];
      const firstError = Array.isArray((error as any)[firstKey])
        ? (error as any)[firstKey][0]
        : (error as any)[firstKey];
      return String(firstError);
    }
  }

  return fallback;
}

export function handleApiError(
  error: any,
  options: HandleApiErrorOptions = ""
): ApiError {
  const opts =
    typeof options === "string" ? { context: options } : (options || {});
  const resolveName = (f: string) => getFieldDisplayName(f, opts.fieldNames);

  const status = error?.response?.status ?? error.status ?? 0;
  const code = isApiError(error)
    ? error.code
    : inferCodeFromStatus(status);

  const message = extractErrorMessage(
    error,
    `No se pudo completar la ${opts.context ?? ""}`.trim(),
    resolveName
  );

  let fieldErrors: FieldErrors | undefined;
  if (isApiError(error) && error.errors) {
    fieldErrors = normalizeFieldErrors(error.errors);
  } else if (error?.response?.data?.errors) {
    fieldErrors = normalizeFieldErrors(error.response.data.errors);
  }

  return {
    status,
    code,
    detail: message,
    errors: fieldErrors,
    raw: error,
  };
}