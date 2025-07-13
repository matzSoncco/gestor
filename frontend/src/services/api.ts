import axios, { AxiosInstance } from 'axios';

/**
 * Obtiene el valor de una cookie por nombre.
 * (No depende de Vue, así que se mantiene como función pura).
 */
function getCookie(name: string): string | undefined {
  return document.cookie
    .split(';')
    .map((c) => c.trim().split('='))
    .reduce<Record<string, string>>((acc, [key, val]) => {
      acc[key] = decodeURIComponent(val);
      return acc;
    }, {})[name];
}

/** Instancia preconfigurada de Axios para todo el proyecto */
const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, // URL declarada en .env
  withCredentials: true,                      // incluye cookies en CORS
  xsrfCookieName: 'csrftoken',
  xsrfHeaderName: 'X-CSRFToken',
  headers: {
    'Content-Type': 'application/json',
    'X-CSRFToken': getCookie('csrftoken') ?? '',
  },
});

export default api;