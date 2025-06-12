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
  baseURL: 'http://127.0.0.1:8000/api/' || 'https://localhost:8000/api/',
  withCredentials: true, // Permite enviar cookies con las solicitudes
  xsrfCookieName: 'csrftoken', // Nombre de la cookie CSRF
  xsrfHeaderName: 'X-CSRFToken', // Nombre del encabezado CSRF
  headers: {
    'Content-Type': 'application/json',
    'X-CSRFToken': getCookie('csrftoken'), // Incluye el token CSRF en los encabezados
  },
});

//exportamos la api
export default api;