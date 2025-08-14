import api from '@/services/authService'
import { handleApiError } from '@/utils/apiErrorHandler'

export async function obtenerNombreProveedor(ruc: string): Promise<string> {
  try {
    const response = await api.get(`/ruc/${ruc}`)
    return response.data.nombre
  } catch (error) {
    // Si hay un contexto, pásalo para mensajes más claros
    handleApiError(error, 'consultar el RUC')
    return '' // Devuelve un string vacío en caso de error
  }
}