import api from '@/services/authService'
import type { Operacion } from '@/types/operacion'

export const fetchOperaciones = () =>
    api.get<Operacion[]>('/operaciones')

export const createOperacion = (payload: Partial<Operacion>) =>
    api.post<Operacion>('/operaciones')

export const updateOperacion = (id: number, payload: Partial<Operacion>) =>
    api.put<Operacion>(`/operaciones/${id}`, payload)

export const deleteOperacion = (id: number) =>
  api.delete(`/operaciones/${id}`)