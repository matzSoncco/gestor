import api from '@/services/authService'

export interface LoginResponse {
  success: boolean
  error?: any
}

export async function login(username: string, password: string): Promise<LoginResponse> {
  try {
    const { data } = await api.post('/token/', { username, password })
    localStorage.setItem('accessToken', data.access)
    localStorage.setItem('refreshToken', data.refresh)
    return { success: true }
  } catch (error) {
    console.error('Error al iniciar sesión', error)
    return { success: false, error }
  }
}