import api from '@/services/authService'
import type { Operacion, OperacionResponse, OperacionBackend  } from '@/types/operacion'
import { handleApiError } from '@/utils/apiErrorHandler'

export const fetchOperaciones = async (params?: Record<string, any>) => {
  try {
    const response = await api.get<OperacionResponse>('/operaciones/', { params })
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

function mapOperacionResponse(data: OperacionBackend): Operacion {
  return {
    id: data.id,
    numero_documento: data.numero_documento,
    ruc_proveedor: data.ruc_proveedor,
    nombre_proveedor: data.nombre_proveedor,
    tipo_operacion: data.tipo_operacion,
    fecha: data.fecha,
    descripcion: data.descripcion,
    costo_total: data.costo_total,
    combustibles: data.combustible_detalle ?? [],
    mantenimientos: data.mantenimiento_detalle ?? [],
    servicios: data.servicio_detalle ?? [],
  };
}

export const fetchOperacionById = async (id: number): Promise<Operacion> => {
  try {
    const response = await api.get<OperacionBackend>(`/operaciones/${id}/`);
    return mapOperacionResponse(response.data);
  } catch (error) {
    throw handleApiError(error, 'Error al obtener operación');
  }
};
