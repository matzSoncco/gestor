import axios from '@/services/authService'

export async function logout() {
  return axios.post('/logout/')
}