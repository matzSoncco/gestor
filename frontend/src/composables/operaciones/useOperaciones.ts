import { ref, computed, watch, nextTick, type Ref } from 'vue';
import { useCombustible } from '@/composables/operaciones/useCombustible';
import { useMantenimiento } from '@/composables/operaciones/useMantenimiento';
import { useServicio } from '@/composables/operaciones/useServicio';
import { useFormActions } from '@/composables/global/useFormActions';
import { useNotify } from '@/composables/global/useNotify';
import { stripTempIds } from '@/utils/payload';
import { validateRequired } from '@/utils/validateRequired';
import { useOperacionStore } from '@/stores/operacionStore';
import { usePagination } from '../global/usePagination';
import { getApiErrorMessage } from '@/utils/apiErroHandler';

import {
  fetchOperaciones,
  createOperacion,
  updateOperacion,
  deleteOperacion,
} from '@/api/operaciones';

import {
  makeOperacionDefaults,
  type Operacion,
} from '@/types/operacion';

/* ------------ Tipo auxiliar DTO sin campos temporales ------------ */
type OperacionDTO = Omit<
  Operacion,
  'combustibles' | 'mantenimientos' | 'servicios' | 'costo_total'
> & {
  combustible_detalle: any[];
  mantenimiento_detalle: any[];
  servicio_detalle: any[];
};

type OperacionFiltros = {
  numero_documento: string;
  fecha_inicio: string | null;
  fecha_fin: string | null;
};

/* ----------------- VALIDACIÓN ----------------- */
function validateOperacion(operacion: Partial<Operacion>): string | null {
  const required: (keyof Operacion)[] = [
    'numero_documento',
    'ruc_proveedor',
    'nombre_proveedor',
    'fecha',
    'tipo_operacion',
  ];

  const requiredValidation = validateRequired(operacion, required)
  if (requiredValidation) return requiredValidation

  if (operacion.fecha) {
    const fecha = new Date(operacion.fecha);
    const hoy = new Date();
    if (fecha > hoy) {
      return 'La fecha de operación no puede ser posterior a hoy';
    }
  }

  if (operacion.tipo_operacion === 'combustible' && 
      (!operacion.combustibles || operacion.combustibles.length === 0)) {
    return 'Debe agregar al menos un registro de combustible';
  }

  if (operacion.tipo_operacion === 'mantenimiento' && 
      (!operacion.mantenimientos || operacion.mantenimientos.length === 0)) {
    return 'Debe agregar al menos un registro de mantenimiento';
  }

  if (operacion.tipo_operacion === 'servicio' && 
      (!operacion.servicios || operacion.servicios.length === 0)) {
    return 'Debe agregar al menos un registro de servicio';
  }

  return null;
}

function buildOperacionPayload(operacion: Partial<Operacion>): OperacionDTO {
  const defaults = makeOperacionDefaults();
  const merged: Operacion = { ...defaults, ...operacion };

  const dto: OperacionDTO = {
    ...merged,
    combustible_detalle: stripTempIds(merged.combustibles || []),
    mantenimiento_detalle: stripTempIds(merged.mantenimientos || []),
    servicio_detalle: stripTempIds(merged.servicios || []),
  };

  // Eliminamos arrays originales y costo_total
  delete (dto as any).combustibles;
  delete (dto as any).mantenimientos;
  delete (dto as any).servicios;
  delete (dto as any).costo_total;

  return dto;
};

export function useOperaciones() {
  const operacionStore = useOperacionStore()
  const defaults = makeOperacionDefaults();
  const { success, error, info } = useNotify();

  /* -------- estado base -------- */
  const isResetting = ref(false);

  const filtros = ref<OperacionFiltros>({
    numero_documento: '',
    fecha_inicio: null,
    fecha_fin: null
  })

  const {
    items: operaciones,
    total,
    currentPage,
    pageSize,
    loading,
    load: loadOperaciones,
    setPage,
    params
  } = usePagination<Operacion>({
    fetcher: fetchOperaciones,
    pageSize: 6,
  })

  const syncStoreWithPagination = () => {
    operacionStore.setOperaciones(operaciones.value)
  }

  const updateOperacionInBothSources = (updated: Operacion) => {
    operacionStore.actualizarOperacion(updated)

    const idx = operaciones.value.findIndex(o => o.id === updated.id)
    if (idx !== -1) {
      operaciones.value[idx] = { ...operaciones.value[idx], ...updated }
    }
  }

  const hayFiltros = computed(() => {
    return filtros.value.numero_documento.trim() !== '' || 
           filtros.value.fecha_inicio !== null || 
           filtros.value.fecha_fin !== null;
  });

  const aplicarFiltros = () => {
    if (!hayFiltros.value) {
      setPage(1);
    }

    const filtrosParams: Record<string, any> = {};
    
    if (filtros.value.numero_documento.trim()) {
      filtrosParams.numero_documento = filtros.value.numero_documento.trim();
    }
    
    if (filtros.value.fecha_inicio) {
      filtrosParams.fecha_inicio = filtros.value.fecha_inicio;
    }
    
    if (filtros.value.fecha_fin) {
      filtrosParams.fecha_fin = filtros.value.fecha_fin;
    }

    params.value = filtrosParams;
    loadOperaciones();
  };

  const loadData = async () => {
    await loadOperaciones()
    syncStoreWithPagination()
  }
  
  //acciones del formulario
  const resetForm = async () => {
    isResetting.value = true;
    await baseReset();
    await nextTick();
    isResetting.value = false;
  };

  const refresh = async () => {
    await loadData()
    info('Datos actualizados')
  }

  /* CRUD */
  const createOperacionAction = async (payload: Partial<Operacion>) => {
    const msg = validateOperacion(payload);
    if (msg) {
      error(msg);
      throw new Error(msg);
    }

    const dto = buildOperacionPayload(payload);

    try {
      const data = await createOperacion(dto);
      
      //actualizar estado local
      operaciones.value = [data, ...operaciones.value]
      operacionStore.agregarOperacion(data);
      
      success('Operación registrada correctamente');
      return data;
    } catch (err) {
      const message = getApiErrorMessage(err, 'No se pudo crear la operación');
      error(message);
      throw err;
    }
  }

  const updateOperacionAction = async (id: number, payload: Partial<Operacion>) => {
    const msg = validateOperacion(payload);
    if (msg) {
      error(msg);
      throw new Error(msg);
    }

    const dto = buildOperacionPayload(payload);

    try {
      const data = await updateOperacion(id, dto);
      updateOperacionInBothSources(data);
      success('Operación actualizada exitosamente');
      return data;
    } catch (err) {
      const message = getApiErrorMessage(err, 'No se pudo actualizar la operación');
      error(message);
      throw err;
    }
  }

  const deleteOperacionAction = async (id: number) => {
    try {
      await deleteOperacion(id);
      
      // Actualizar estado local
      operaciones.value = operaciones.value.filter(op => op.id !== id);
      operacionStore.setOperaciones(operacionStore.operaciones.filter(op => op.id !== id))
      
      success('Operación eliminada correctamente');
    } catch (err) {
      error('Error al eliminar la operación');
      throw err;
    }
  };

  const {
    formData,
    loading: formLoading,
    resetForm: baseReset,
    submitForm,
  } = useFormActions<Operacion>({
    defaults,
    onSubmitService: createOperacionAction,
    onResetCallback: () => info('Formulario limpiado'),
  })

  const combustibleComposable = useCombustible(formData as Ref<Operacion>);
  const mantenimientoComposable = useMantenimiento(formData as Ref<Operacion>);
  const servicioComposable = useServicio(formData as Ref<Operacion>);

  watch(
    () => formData.value.tipo_operacion,
    (nuevoTipo, tipoAnterior) => {
      if (isResetting.value || nuevoTipo === tipoAnterior) return;

      // Helper para limpiar arrays con notificación
      const limpiarDetalle = (campo: keyof Operacion, mensaje: string) => {
        const array = formData.value[campo] as unknown[];
        if (Array.isArray(array) && array.length > 0) {
          (formData.value as any)[campo] = [];
          info(mensaje);
        }
      };

      // Limpiar detalles no correspondientes al nuevo tipo
      if (nuevoTipo !== 'combustible') {
        limpiarDetalle('combustibles', 'Registros de combustible descartados');
      }
      if (nuevoTipo !== 'mantenimiento') {
        limpiarDetalle('mantenimientos', 'Registros de mantenimiento descartados');
      }
      if (nuevoTipo !== 'servicio') {
        limpiarDetalle('servicios', 'Registros de servicio descartados');
      }

      // Agregar fila inicial para el nuevo tipo si no existe
      if (nuevoTipo === 'combustible' && formData.value.combustibles.length === 0) {
        combustibleComposable.addCombustibleRow();
      }
      if (nuevoTipo === 'mantenimiento' && formData.value.mantenimientos.length === 0) {
        mantenimientoComposable.addMantenimientoRow();
      }
      if (nuevoTipo === 'servicio' && formData.value.servicios.length === 0) {
        servicioComposable.addServicioRow();
      }
    },
  );

  //calculos computados para costos
  const costoTotalOperacion = computed(() => {
    const { costoTotalCombustible } = combustibleComposable;
    const { costoTotalMantenimiento } = mantenimientoComposable;
    const { costoTotalServicio } = servicioComposable;

    switch (formData.value.tipo_operacion) {
      case 'combustible':
        return costoTotalCombustible.value;
      case 'mantenimiento':
        return costoTotalMantenimiento.value;
      case 'servicio':
        return costoTotalServicio.value;
      default:
        return 0;
    }
  });

  /* ------------- API pública del composable ------------------- */
  return {
    operaciones,
    loading,
    total,
    currentPage,
    pageSize,
    setPage,

    // Filtros
    filtros,
    aplicarFiltros,

    // Estado del formulario
    formData,
    formLoading,
    resetForm,
    submitForm,

    // Operaciones CRUD
    loadData,
    createOperacion: createOperacionAction,
    updateOperacion: updateOperacionAction,
    deleteOperacion: deleteOperacionAction,

    refresh,

    // Sub-composables - Combustible
    addCombustibleRow: combustibleComposable.addCombustibleRow,
    removeCombustibleRow: combustibleComposable.removeCombustibleRow,
    costoTotalCombustible: combustibleComposable.costoTotalCombustible,

    // Sub-composables - Mantenimiento
    addMantenimientoRow: mantenimientoComposable.addMantenimientoRow,
    removeMantenimientoRow: mantenimientoComposable.removeMantenimientoRow,
    updateSugerencias: mantenimientoComposable.updateSugerencias,
    sugerencias: mantenimientoComposable.sugerencias,
    blurHandler: mantenimientoComposable.blurHandler,
    costoTotalMantenimiento: mantenimientoComposable.costoTotalMantenimiento,

    // Sub-composables - Servicio
    addServicioRow: servicioComposable.addServicioRow,
    removeServicioRow: servicioComposable.removeServicioRow,
    costoTotalServicio: servicioComposable.costoTotalServicio,

    // Computadas
    costoTotalOperacion,

    isResetting,
  };
}