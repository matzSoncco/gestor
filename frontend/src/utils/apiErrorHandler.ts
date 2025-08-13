import type { ApiError, FieldErrors } from "@/types/errors";
import { isApiError } from "@/types/errors";

// Busca mensajes en estructuras anidadas
function findDeepErrorMessage(data: any): string | null {
  if (!data) return null;

  if (typeof data === "string") return data;

  if (Array.isArray(data)) {
    for (const item of data) {
      const found = findDeepErrorMessage(item);
      if (found) return found;
    }
  }

  if (typeof data === "object") {
    for (const key of Object.keys(data)) {
      const found = findDeepErrorMessage(data[key]);
      if (found) {
        const fieldName = getFieldDisplayName(key);
        return `${fieldName}: ${found}`;
      }
    }
  }

  return null;
}

// Convierte errores anidados en objeto plano tipo { campo: [errores] }
function normalizeFieldErrors(errors: any, parentKey = ""): FieldErrors {
  const result: FieldErrors = {};

  if (Array.isArray(errors)) {
    errors.forEach((item, index) => {
      const prefix = parentKey ? `${parentKey}[${index}]` : `[${index}]`;
      Object.assign(result, normalizeFieldErrors(item, prefix));
    });
  } else if (typeof errors === "object" && errors !== null) {
    for (const key in errors) {
      const newKey = parentKey ? `${parentKey}.${key}` : key;
      Object.assign(result, normalizeFieldErrors(errors[key], newKey));
    }
  } else {
    result[parentKey] = Array.isArray(errors) ? errors : [String(errors)];
  }

  return result;
}

function getFieldDisplayName(field: string): string {
  const fieldNames: Record<string, string> = {
    username: "nombre de usuario",
    password: "contraseña",
    fecha: "fecha",
    monto: "monto",
    descripcion: "descripción",
    tipo_operacion: "tipo de operación",
    servicio_detalle: "detalle del servicio",
    mantenimiento_detalle: "detalle del mantenimiento",
    combustible_detalle: "detalle del combustible",
    placa_vehiculo: "placa del vehículo",
    galones: "galones",
    precio_galon: "precio por galón",
    total: "total",
    subtotal: "subtotal",
    non_field_errors: "el formulario",
  };

  if (field.includes("[") && field.includes("]")) {
    const baseField = field.split("[")[0];
    const nestedField = field.split(".").pop();
    const baseName = fieldNames[baseField] || baseField.replace(/_/g, " ");
    const nestedName = nestedField
      ? fieldNames[nestedField] || nestedField.replace(/_/g, " ")
      : "";
    return nestedName ? `${baseName} - ${nestedName}` : baseName;
  }

  return fieldNames[field] || field.replace(/_/g, " ");
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

function extractErrorMessage(error: any, fallback = "Ocurrió un error"): string {
  if (!error) return fallback;
  if (typeof error === "string") return error;

  if (isApiError(error)) return error.detail;

  const responseData = error?.response?.data;
  if (responseData) {
    if (responseData.detail) return responseData.detail;
    if (responseData.errors) {
      const deepMsg = findDeepErrorMessage(responseData.errors);
      if (deepMsg) return deepMsg;
    }

    if (typeof responseData === "object") {
      const keys = Object.keys(responseData);
      if (keys.length > 0) {
        const firstKey = keys[0];
        const firstError = Array.isArray(responseData[firstKey])
          ? responseData[firstKey][0]
          : responseData[firstKey];
        const fieldName = getFieldDisplayName(firstKey);
        return firstKey === "non_field_errors"
          ? firstError
          : `Error en ${fieldName}: ${firstError}`;
      }
    }

    if (typeof responseData === "string") return responseData;
  }

  if (error?.message && !error?.response) {
    return `Error de conexión: ${error.message}`;
  }

  if (typeof error === "object" && !error?.response) {
    const keys = Object.keys(error);
    if (keys.length > 0) {
      const firstKey = keys[0];
      const firstError = Array.isArray(error[firstKey])
        ? error[firstKey][0]
        : error[firstKey];
      return firstError;
    }
  }

  return fallback;
}

export function handleApiError(error: any, context = ""): never {
  let status = error?.response?.status ?? error.status ?? 0;
  let code = isApiError(error)
    ? error.code
    : inferCodeFromStatus(status);

  let message = extractErrorMessage(error, `No se pudo completar la ${context}`);
  let fieldErrors: FieldErrors | undefined;

  if (isApiError(error) && error.errors) {
    fieldErrors = normalizeFieldErrors(error.errors);
  } else if (error?.response?.data?.errors) {
    fieldErrors = normalizeFieldErrors(error.response.data.errors);
  }

  const apiError: ApiError = {
    status,
    code,
    detail: message,
    errors: fieldErrors,
    raw: error,
  };

  throw apiError;
}