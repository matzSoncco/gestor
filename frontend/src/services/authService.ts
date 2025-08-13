import axios, { AxiosInstance, AxiosError } from 'axios'
import type { ApiError } from "@/types/errors";
import { useAuthStore } from '@/stores/auth'

// Aquí puedes extender el header más adelante con el token
const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 20000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Interceptor para agregar token JWT automáticamente
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  error => Promise.reject(error)
)

function toApiError(error: AxiosError): ApiError {
  const status = error.response?.status ?? 0;
  const data = (error.response?.data ?? {}) as any;

  // Mensaje más específico basado en el contexto
  let detail = "Ocurrió un error inesperado.";
  
  // Si hay datos estructurados del backend
  if (data && typeof data === "object") {
    // Priorizar detail si existe
    if (data.detail) {
      detail = data.detail;
    }
    // Si no hay detail pero hay errors, construir mensaje más descriptivo
    else if (data.errors) {
      detail = buildDetailFromErrors(data.errors, status);
    }
    // Si hay message
    else if (data.message) {
      detail = data.message;
    }
    // Mensajes específicos por código de estado
    else {
      detail = getStatusSpecificMessage(status);
    }
  } else {
    detail = getStatusSpecificMessage(status);
  }

  return {
    status,
    code: data.code ?? inferCode(status),
    detail,
    errors: data.errors,
    raw: data
  };
}

function buildDetailFromErrors(errors: any, status: number): string {
  if (!errors || typeof errors !== 'object') {
    return getStatusSpecificMessage(status);
  }

  // Si es un objeto con campos específicos
  const errorKeys = Object.keys(errors);
  if (errorKeys.length === 0) {
    return getStatusSpecificMessage(status);
  }

  // Si solo hay un campo con error, ser más específico
  if (errorKeys.length === 1) {
    const field = errorKeys[0];
    const fieldErrors = errors[field];
    
    if (Array.isArray(fieldErrors) && fieldErrors.length > 0) {
      const fieldName = getFieldDisplayName(field);
      return `Error en ${fieldName}: ${fieldErrors[0]}`;
    }
  }

  // Si hay múltiples campos con errores
  if (errorKeys.length > 1) {
    return `Se encontraron errores en ${errorKeys.length} campos. Revisa la información ingresada.`;
  }

  return getStatusSpecificMessage(status);
}

function getFieldDisplayName(field: string): string {
  const fieldNames: Record<string, string> = {
    'fecha': 'fecha',
    'monto': 'monto',
    'descripcion': 'descripción',
    'tipo_operacion': 'tipo de operación',
    'servicio_detalle': 'detalle del servicio',
    'placa_vehiculo': 'placa del vehículo',
    'cantidad_galones': 'galones',
    'precio_galon': 'precio por galón',
    'non_field_errors': 'formulario'
  };

  return fieldNames[field] || field.replace(/_/g, ' ');
}

function getStatusSpecificMessage(status: number): string {
  switch (status) {
    case 400: 
      return "Los datos enviados no son válidos. Verifica la información ingresada.";
    case 401: 
      return "Tu sesión ha expirado. Por favor, inicia sesión nuevamente.";
    case 403: 
      return "No tienes permisos para realizar esta acción.";
    case 404: 
      return "El recurso solicitado no fue encontrado.";
    case 405: 
      return "Método no permitido para esta operación.";
    case 413: 
      return "El archivo o datos enviados son demasiado grandes.";
    case 422: 
      return "Los datos no pudieron ser procesados. Revisa la información.";
    case 429: 
      return "Has realizado demasiadas solicitudes. Espera un momento e intenta de nuevo.";
    case 500: 
      return "Error interno del servidor. Intenta de nuevo más tarde.";
    case 502: 
      return "Servicio temporalmente no disponible. Intenta de nuevo.";
    case 503: 
      return "Servicio en mantenimiento. Intenta de nuevo más tarde.";
    default:  
      if (status === 0) {
        return "No se pudo conectar con el servidor. Verifica tu conexión a internet.";
      }
      return "Ocurrió un error inesperado. Si el problema persiste, contacta al soporte.";
  }
}

function inferCode(status: number): string {
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
    case 502: return "BAD_GATEWAY";
    case 503: return "SERVICE_UNAVAILABLE";
    default:  return "ERROR";
  }
}

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const apiError = toApiError(error);
    
    // Log detallado para desarrollo
    if (import.meta.env.DEV) {
      console.group('🔴 API Error Details');
      console.log('Status:', apiError.status);
      console.log('Code:', apiError.code);
      console.log('Detail:', apiError.detail);
      console.log('Errors:', apiError.errors);
      console.log('Raw Response:', apiError.raw);
      console.groupEnd();
    }
    
    // Manejo global de auth
    if (apiError.code === "UNAUTHENTICATED") {
      const auth = useAuthStore();
      auth.logout(); // limpia token y redirige a login
    }
    
    return Promise.reject(apiError);
  }
)

export default api