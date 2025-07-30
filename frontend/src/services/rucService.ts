import api from '@/services/authService'
import { parseApiError } from '@/utils/parseApiError'

export async function obtenerNombreProveedor(ruc: string): Promise<string> {
  try {
    const response = await api.get(`/ruc/${ruc}`)
    return response.data.nombre
  } catch (error) {
    const msg = parseApiError(error, 'Error al consultar el RUC')
    throw new Error(msg) 
  }
}