import axios, { AxiosInstance } from 'axios'
import router from '@/routers/index'
import { useAuthStore } from '@/stores/auth'

// Aquí puedes extender el header más adelante con el token
const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
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

api.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status === 401) {
      const auth = useAuthStore()

      auth.logout()
      router.push('/login')
    }
    return Promise.reject(error)
  }
)

export default api