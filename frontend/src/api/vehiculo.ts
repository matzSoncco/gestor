import axios from '@/services/api'          // o tu instancia ya configurada
import type { Vehiculo } from '@/types/vehiculo'

export const fetchVehiculos = () =>
  axios.get<Vehiculo[]>('/vehiculos')

export const createVehiculo = (payload: Partial<Vehiculo>) =>
  axios.post<Vehiculo>('/vehiculos', payload)

export const updateVehiculo = (id: number, payload: Partial<Vehiculo>) =>
  axios.put<Vehiculo>(`/vehiculos/${id}`, payload)

export const deleteVehiculo = (id: number) =>
  axios.delete(`/vehiculos/${id}`)