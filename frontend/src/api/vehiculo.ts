import api from '@/services/authService'          // o tu instancia ya configurada
import type { Vehiculo } from '@/types/vehiculo'

export const fetchVehiculos = () =>
  api.get<Vehiculo[]>('/vehiculos')

export const createVehiculo = (payload: Partial<Vehiculo>) =>
  api.post<Vehiculo>('/vehiculos', payload)

export const updateVehiculo = (id: number, payload: Partial<Vehiculo>) =>
  api.put<Vehiculo>(`/vehiculos/${id}`, payload)

export const deleteVehiculo = (id: number) =>
  api.delete(`/vehiculos/${id}`)