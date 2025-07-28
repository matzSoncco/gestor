import api from '@/services/authService'
import type { Operacion } from '@/types/operacion'

export const fetchOperaciones = (params?: Record<string, any>) =>
  api.get('/operaciones', { params })

export const createOperacion = (payload: Partial<Operacion>) =>
    api.post<Operacion>('/operaciones', payload)

export const updateOperacion = (id: number, payload: Partial<Operacion>) =>
    api.put<Operacion>(`/operaciones/${id}`, payload)

export const deleteOperacion = (id: number) =>
  api.delete(`/operaciones/${id}`)