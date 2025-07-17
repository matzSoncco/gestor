import api from '@/services/authService'

export const getCurrentUser = async () => {
  try {
    const response = await api.get('/user/me/') // o el endpoint real
    return {
      success: true,
      user: response.data,
    }
  } catch (error) {
    console.error('Error al obtener usuario actual', error)
    return {
      success: false,
      user: null,
    }
  }
}