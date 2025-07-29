import type { AxiosResponse } from 'axios'
import api from '@/services/authService'
import type { Vehiculo, MantenimientoResponse } from '@/types/vehiculo'
import { handleApiError } from '@/utils/apiWrapper'

export const fetchVehiculos = async (params?: Record<string, any>) => {
  try {
    const response = await api.get<Vehiculo>('/vehiculos/', { params })
    return response.data
  } catch (error) {
    throw handleApiError(error, 'Error al buscar vehículos')
  }
}

export const createVehiculo = async (payload: Partial<Vehiculo>): Promise<Vehiculo> => {
  try {
    const response = await api.post<Vehiculo>('/vehiculos/', payload)
    return response.data
  } catch (error) {
    throw handleApiError(error, 'Error al crear el vehículo')
  }
}

export const updateVehiculo = async (id: number, payload: Partial<Vehiculo>) => {
  try {
    const response = await api.put<Vehiculo>(`/vehiculos/${id}`, payload)
    return response.data
  } catch (error) {
    throw handleApiError(error, 'Error al actualizar vehículo')
  }
}

export const deleteVehiculo = async (id: number) => {
  try {
    const response = await api.delete(`/vehiculos/${id}`)
    return response.data
  } catch (error) {
    throw handleApiError(error, 'Error al eliminar vehículo')
  }
}

export function registrarMantenimiento(
  vehiculoId: number,
  observaciones = ''
): Promise<AxiosResponse<MantenimientoResponse>> {
  try {
    const response = api.post(`/vehiculos/${vehiculoId}/registrar_mantenimiento_hito/`, { observaciones })
    return response
  }  catch (error) {
    throw handleApiError(error, 'Error al registrar mantenimiento')
  }
}

export function actualizarKilometraje(vehiculoId: number, kilometraje: number) {
  try {
    const response = api.patch(`/vehiculos/${vehiculoId}/actualizar_kilometraje/`, {
      kilometraje
    })
    return response
  } catch(error) {
    throw handleApiError(error, 'Error al actualizar el kilometraje')
  }
}