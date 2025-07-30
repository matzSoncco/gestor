import api from '@/services/authService'
import type { Operacion } from '@/types/operacion'
import { handleApiError } from '@/utils/apiWrapper'

export const fetchOperaciones = async (params?: Record<string, any>) => {
  try {
    const response = await api.get<Operacion>('/operaciones/', { params })
    return response.data
  } catch (error) {
    throw handleApiError(error, 'Error al buscar operaciones')
  }
}

export const createOperacion = async (payload: Partial<Operacion>) => {
  try {
    const response = await api.post<Operacion>('/operaciones/', payload)
    return response.data
  } catch (error) {
    throw handleApiError(error, 'Error al crear la operación')
  }
}

export const updateOperacion = async (id: number, payload: Partial<Operacion>) => {
  try {
    const response = await api.put<Operacion>(`/operaciones/${id}`, payload)
    return response.data
  } catch (error) {
    throw handleApiError(error, 'Error al actualizar operación')
  }
}

export const deleteOperacion = async (id: number) => {
  try {
    const response = await api.delete<Operacion>(`/operaciones/${id}`)
  } catch (error) {
    throw handleApiError(error, 'Error al eliminar operación')
  }
}