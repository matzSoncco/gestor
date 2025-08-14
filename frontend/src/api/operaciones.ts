import api from '@/services/authService'
import type { Operacion, OperacionResponse, OperacionBackend  } from '@/types/operacion'
import { handleApiError } from '@/utils/apiErrorHandler'
import { stripTempIds, assignTempIds } from '@/utils/payload';
import { makeOperacionDefaults } from '@/types/operacion';

export const fetchOperaciones = async (params?: Record<string, any>) => {
  try {
    const response = await api.get<OperacionResponse>('/operaciones/', { params })
    return response.data
  } catch (error) {
    throw handleApiError(error, 'Error al buscar operaciones')
  }
}

export const createOperacion = async (payload: OperacionBackend) => {
  try {
    const response = await api.post<Operacion>('/operaciones/', payload);
    return response.data;
  } catch (error) {
    throw handleApiError(error, 'Error al crear la operación');
  }
};

export const updateOperacion = async (id: number, payload: OperacionBackend) => {
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
    fecha: new Date(data.fecha).getTime(),
    descripcion: data.descripcion,
    costo_total: data.costo_total,
    combustible_detalle: assignTempIds(data.combustible_detalle ?? []),
    mantenimiento_detalle: assignTempIds(data.mantenimiento_detalle ?? []),
    servicio_detalle: assignTempIds(data.servicio_detalle ?? []),
  };
}

export function mapOperacionRequest(operacion: Partial<Operacion>): OperacionBackend {
  const defaults = makeOperacionDefaults();
  const merged: Operacion = { ...defaults, ...operacion };

  return {
    id: merged.id,
    numero_documento: merged.numero_documento,
    ruc_proveedor: merged.ruc_proveedor,
    nombre_proveedor: merged.nombre_proveedor,
    tipo_operacion: merged.tipo_operacion,
    fecha: new Date(merged.fecha).toISOString().split("T")[0], // YYYY-MM-DD
    descripcion: merged.descripcion,
    costo_total: merged.costo_total,
    combustible_detalle: stripTempIds(merged.combustible_detalle || []),
    mantenimiento_detalle: stripTempIds(merged.mantenimiento_detalle || []),
    servicio_detalle: stripTempIds(merged.servicio_detalle || []),
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
