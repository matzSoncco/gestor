import type { AxiosResponse } from 'axios'
import api from '@/services/authService'          // o tu instancia ya configurada
import type { Vehiculo, MantenimientoResponse } from '@/types/vehiculo'

export const fetchVehiculos = () =>
  api.get<Vehiculo[]>('/vehiculos')

export const createVehiculo = (payload: Partial<Vehiculo>) =>
  api.post<Vehiculo>('/vehiculos', payload)

export const updateVehiculo = (id: number, payload: Partial<Vehiculo>) =>
  api.put<Vehiculo>(`/vehiculos/${id}`, payload)

export const deleteVehiculo = (id: number) =>
  api.delete(`/vehiculos/${id}`)

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