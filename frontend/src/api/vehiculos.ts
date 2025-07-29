import type { AxiosResponse } from 'axios'
import api from '@/services/authService'
import type { Vehiculo, MantenimientoResponse } from '@/types/vehiculo'

export const fetchVehiculos = async (params?: Record<string, any>) => {
  try {
    const response = await api.get('/vehiculos/', { params })
    return response.data
  } catch (error:any) {
    if (error.response?.data) {
      throw error.response.data
    }
    throw new Error('Error inesperado al buscar los vehículos')
  }
}

export const createVehiculo = async (payload: Partial<Vehiculo>) => {
  try {
    const response = await api.post<Vehiculo>('/vehiculos/', payload)
    return response.data
  } catch (error:any) {
    if (error.response?.data) {
      throw error.response.data
    }
    throw new Error('Error inesperado al crear el vehículo')
  }
}

export const updateVehiculo = async (id: number, payload: Partial<Vehiculo>) => {
  try {
    const response = await api.put<Vehiculo>(`/vehiculos/${id}`, payload)
    return response.data
  } catch (error:any) {
    if (error.response?.data) {
      throw error.response.data
    }
    throw new Error('Error inesperado al actualizar el vehículo')
  }
}

export const deleteVehiculo = async (id: number) => {
  try {
    const response = await api.delete(`/vehiculos/${id}`)
    return response.data
  } catch (error:any) {
    if (error.response?.data) {
      throw error.response.data
    }
    throw new Error('Error inesperado al eliminar el vehículo')
  }
}

export function registrarMantenimiento(
  vehiculoId: number,
  observaciones = ''
): Promise<AxiosResponse<MantenimientoResponse>> {
  return api.post(`/vehiculos/${vehiculoId}/registrar_mantenimiento_hito/`, { observaciones })
}

export function actualizarKilometraje(vehiculoId: number, kilometraje: number) {
  return api.patch(`/vehiculos/${vehiculoId}/actualizar_kilometraje/`, {
    kilometraje
  })
}