export type FieldErrors = Record<string, string[]>;

export interface ApiError {
  status: number;
  code: string;         // p.ej. VALIDATION_ERROR, UNAUTHENTICATED...
  detail: string;       // mensaje humano
  errors?: FieldErrors; // errores por campo
  raw?: unknown;        // respuesta original por si quieres loguear
}

export const isApiError = (e: unknown): e is ApiError =>
  !!e && typeof e === "object" && "code" in (e as any) && "detail" in (e as any);