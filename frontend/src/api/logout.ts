import axios from '@/services/authService'

export async function logout() {
  try {
    await axios.post('/logout/') // o lo que sea que tu backend acepte
  } catch (error) {
    console.error('Error en logout', error)
  }
}