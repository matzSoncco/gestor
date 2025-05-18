import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_APP_API_URL || 'http://127.0.0.1:8000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para añadir token de autenticación
apiClient.interceptors.request.use(config => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, error => {
  return Promise.reject(error);
});

// Opcional: Interceptor para manejar errores 401 (Unauthorized) y refrescar token
// apiClient.interceptors.response.use(response => response, async error => {
//   const originalRequest = error.config;
//   if (error.response.status === 401 && !originalRequest._retry) {
//     originalRequest._retry = true;
//     try {
//       const refreshToken = localStorage.getItem('authRefreshToken');
//       if (!refreshToken) return Promise.reject(error); // No hay refresh token
//       const rs = await axios.post(`${apiClient.defaults.baseURL}/token/refresh/`, { refresh: refreshToken });
//       const { access } = rs.data;
//       localStorage.setItem('authToken', access);
//       apiClient.defaults.headers.common['Authorization'] = `Bearer ${access}`;
//       originalRequest.headers['Authorization'] = `Bearer ${access}`;
//       return apiClient(originalRequest);
//     } catch (_error) {
//       // Si el refresh token falla, desloguear
//       // store.dispatch('auth/logout'); // Si usas Vuex clásico
//       // O llamar a una acción del store de Pinia si está disponible aquí
//       console.error("Refresh token failed", _error);
//       localStorage.removeItem('authToken');
//       localStorage.removeItem('authRefreshToken');
//       localStorage.removeItem('authUser');
//       // Redirigir a login
//       // window.location.href = '/login'; // O usar router si está disponible
//       return Promise.reject(_error);
//     }
//   }
//   return Promise.reject(error);
// });


export default {
  login(credentials) {
    // Asume que tu backend espera 'username' y 'password' para Simple JWT
    // o 'email' y 'password' si has personalizado el User model y el serializer de login
    return apiClient.post('/token/', credentials); // Endpoint para obtener token (ej. DRF Simple JWT)
  },

  // fetchCurrentUser() { // Ejemplo si tienes un endpoint para datos del usuario
  //   return apiClient.get('/users/me/');
  // },

  submitFormData(data) {
    return apiClient.post('/form-submit/', data); // Asegúrate que este endpoint exista en Django
  },

  uploadCsvFile(formData) {
    return apiClient.post('/csv-upload/', formData, { // Asegúrate que este endpoint exista
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  generateReport(format, params = {}) { // format puede ser 'excel' o 'pdf'
    return apiClient.get(`/report-generate/`, { // Asegúrate que este endpoint exista
      params: { ...params, format: format }, // Enviar formato como parámetro
      responseType: 'blob',
    });
  },
};