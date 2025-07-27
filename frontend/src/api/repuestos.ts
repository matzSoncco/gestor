import api from '@/services/authService'

export async function fetchRepuestosByQuery(q: string) {
  const response = await api.get('/repuestos/', {
    params: { search: q }
  })
  return response.data
}
