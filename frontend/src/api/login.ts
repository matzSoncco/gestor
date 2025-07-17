import api from '@/services/authService'

export interface LoginResponse {
  success: boolean
  error?: any
  token?: string
  user?: {
    id: number
    username: string
    email?: string
    role?: string
  }
}

export async function login(username: string, password: string): Promise<LoginResponse> {
  try {
    const { data } = await api.post('/token/', { username, password })
    
    // Guardar tokens en localStorage
    localStorage.setItem('accessToken', data.access)
    localStorage.setItem('refreshToken', data.refresh)
    
    // Opcional: Decodificar el token para obtener información del usuario
    let userInfo = null
    try {
      const payload = JSON.parse(atob(data.access.split('.')[1]))
      userInfo = {
        id: payload.user_id || 0,
        username: payload.username || username,
        email: payload.email || '',
        role: payload.role || ''
      }
    } catch (decodeError) {
      console.warn('No se pudo decodificar el token:', decodeError)
      userInfo = {
        id: 0,
        username: username,
        email: '',
        role: ''
      }
    }
    
    return { 
      success: true, 
      token: data.access,
      user: userInfo 
    }
  } catch (error) {
    console.error('Error al iniciar sesión', error)
    return { success: false, error }
  }
}

// Función adicional para obtener información del usuario actual
export async function getCurrentUser() {
  try {
    const { data } = await api.get('/user/me/')
    return { success: true, user: data }
  } catch (error) {
    console.error('Error al obtener usuario actual:', error)
    return { success: false, error }
  }
}