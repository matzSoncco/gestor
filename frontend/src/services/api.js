import axios from 'axios';

//metodo para obtener el token de autenticación
function getCookie(name) {
  const cookies = document.cookie
    .split(';')
    .map(c => c.trim().split('='))
    .reduce((acc, [key, val]) => ({ ...acc, [key]: decodeURIComponent(val) }), {});
  return cookies[name];
}

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
  xsrfCookieName: 'csrftoken',
  xsrfHeaderName: 'X-CSRFToken',

  headers: {
    'Content-Type': 'application/json',
    'X-CSRFToken': getCookie('csrftoken'), // Incluye el token CSRF en los encabezados
  },
});

//exportamos la api
export default api;