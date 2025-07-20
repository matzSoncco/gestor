import { ref, watch, nextTick, type Ref } from 'vue';

import {
  fetchOperaciones,
  createOperacion,
  updateOperacion,
  deleteOperacion,
} from '@/api/operaciones';

import { useCombustible } from '@/composables/operaciones/useCombustible';
import { useMantenimiento } from '@/composables/operaciones/useMantenimiento';
import { useServicio } from '@/composables/operaciones/useServicio';
import { useFormActions } from '@/composables/global/useFormActions';
import { useNotify } from '@/composables/global/useNotify';
import { stripTempIds } from '@/utils/payload';
import { validateRequired } from '@/utils/validateRequired';
import { useOperacionStore } from '@/stores/operacionStore';
import { usePagination } from '../global/usePagination';

import {
  makeOperacionDefaults,
  type Operacion,
} from '@/types/operacion';

/* ------------ Tipo auxiliar DTO sin campos temporales ------------ */
type OpDTO = Omit<
  Operacion,
  'combustibles' | 'mantenimientos' | 'servicios' | 'costo_total'
> & {
  combustible_detalle: any[];
  mantenimiento_detalle: any[];
  servicio_detalle: any[];
};

/* ----------------- VALIDACIÓN ----------------- */
function validateOperacion(p: Partial<Operacion>): string | null {
  const required: (keyof Operacion)[] = [
    'numero_documento',
    'ruc_proveedor',
    'nombre_proveedor',
    'fecha',
    'tipo_operacion',
  ];

  return validateRequired(p, required);
}

export function useOperaciones() {
  const operacionStore = useOperacionStore()
  /* -------- estado base -------- */
  const isResetting = ref(false);
  const defaults = makeOperacionDefaults();
  const { success, error, info } = useNotify();

  const filtros = ref({
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

  const aplicarFiltros = () => {
  const hayFiltros = filtros.value.numero_documento.trim() !== '' || 
                    filtros.value.fecha_inicio !== null || 
                    filtros.value.fecha_fin !== null;

  if (!hayFiltros) {
    setPage(1);
  }

  const filtrosParams: Record<string, any> = {};
  
  if (filtros.value.numero_documento.trim()) {
    filtrosParams.numero_documento = filtros.value.numero_documento.trim();
  }
  
  if (filtros.value.fecha_inicio) {
    console.log('Fecha inicio original:', filtros.value.fecha_inicio);
    console.log('Tipo de fecha inicio:', typeof filtros.value.fecha_inicio);
    
    // Método más directo - enviar tal como viene del input
    filtrosParams.fecha_inicio = filtros.value.fecha_inicio;
    
    console.log('Fecha inicio que se enviará:', filtrosParams.fecha_inicio);
  }
  
  if (filtros.value.fecha_fin) {
    console.log('Fecha fin original:', filtros.value.fecha_fin);
    filtrosParams.fecha_fin = filtros.value.fecha_fin;
    console.log('Fecha fin que se enviará:', filtrosParams.fecha_fin);
  }

  console.log('Todos los parámetros que se envían:', filtrosParams);
  
  params.value = filtrosParams;
  loadOperaciones();
};

  /* -------- helpers para la construcción del DTO -------- */
  const buildOperacionDTO = (payload: Partial<Operacion>): OpDTO => {
    const merged: Operacion = { ...defaults, ...payload };

    const dto: OpDTO = {
      ...merged,
      combustible_detalle: stripTempIds(merged.combustibles),
      mantenimiento_detalle: stripTempIds(merged.mantenimientos),
      servicio_detalle: stripTempIds(merged.servicios),
    };

    // Eliminamos arrays originales y costo_total
    delete (dto as any).combustibles;
    delete (dto as any).mantenimientos;
    delete (dto as any).servicios;
    delete (dto as any).costo_total;

    return dto;
  };

  /* -------- crear operación -------- */
  const create = async (payload: Partial<Operacion>) => {
    const validationMsg = validateOperacion(payload);
    if (validationMsg) {
      error(validationMsg);
      throw new Error(validationMsg);
    }

    const dto = buildOperacionDTO(payload);

    try {
      const { data } = await createOperacion(dto);
      success('Operación registrada correctamente');
      operaciones.value.unshift(data)
      operacionStore.agregarOperacion(data) // 🆕
      return data;
    } catch (e) {
      error('Error al registrar la operación');
      throw e;
    }
  };

  /* -------- actualizar operación -------- */
  const update = async (id: number, payload: Partial<Operacion>) => {
    const validationMsg = validateOperacion(payload);
    if (validationMsg) {
      error(validationMsg);
      throw new Error(validationMsg);
    }

    const dto = buildOperacionDTO(payload);

    try {
      const { data } = await updateOperacion(id, dto);
      const idx = operaciones.value.findIndex((op) => op.id === id);
      if (idx !== -1) operaciones.value[idx] = data
      operacionStore.actualizarOperacion(data) // 🆕
      success('Operación actualizada correctamente');
      return data;
    } catch (e) {
      error('Error al actualizar la operación');
      throw e;
    }
  };

  /* -------- eliminar operación -------- */
  const remove = async (id: number) => {
    try {
      await deleteOperacion(id);
      operaciones.value = operaciones.value.filter(op => op.id !== id)
      operacionStore.eliminarOperacion(id) // 🆕
      success('Operación eliminada correctamente');
    } catch (e) {
      error('Error al eliminar la operación');
      throw e;
    }
  };

  /* ------------ acciones genéricas del formulario ------------ */
  const {
    formData,
    loading: formLoading, // Renamed to avoid conflict with 'loading' for list
    resetForm: baseReset,
    submitForm,
  } = useFormActions<Operacion>({
    defaults,
    // onSubmitService now only handles creation, 'create' function handles it
    onSubmitService: create, // The form now directly calls our 'create' function
    onResetCallback: () => info('Formulario limpiado'),
  });

  const resetForm = async () => {
    isResetting.value = true;
    await baseReset();
    await nextTick();
    isResetting.value = false;
  };

  /**
   * Sets the formData to an existing operation for editing.
   * @param operacion The operation object to edit.
   */
  const editOperacion = (operacion: Operacion) => {
    // Deep copy to ensure independence from the list object
    formData.value = JSON.parse(JSON.stringify(operacion));
  };

  /* ------ sub-composables por sección ---------- */
  const { addCombustibleRow, removeCombustibleRow, costoTotalCombustible } =
    useCombustible(formData as Ref<Operacion>);

  const { addMantenimientoRow, removeMantenimientoRow, costoTotal, ...mant } =
    useMantenimiento(formData as Ref<Operacion>);

  const { addServicioRow, removeServicioRow, costoTotalServicio } =
    useServicio(formData as Ref<Operacion>);

  /* ------------- watcher de tipo_operacion --------------- */
  watch(
    () => formData.value.tipo_operacion,
    (nuevo, viejo) => {
      if (isResetting.value || nuevo === viejo) return;
      const fd = formData.value;

      const descartar = (campo: keyof Operacion, msg: string) => {
        const arr = fd[campo] as unknown[];
        if (Array.isArray(arr) && arr.length) {
          (fd as any)[campo] = [];
          info(msg);
        }
      };

      if (nuevo !== 'combustible') descartar('combustibles', 'Descartado combustible');
      if (nuevo !== 'mantenimiento') descartar('mantenimientos', 'Descartado mantenimiento');
      if (nuevo !== 'servicio') descartar('servicios', 'Descartado servicio');

      if (nuevo === 'combustible' && !fd.combustibles.length) addCombustibleRow();
      if (nuevo === 'mantenimiento' && !fd.mantenimientos.length) addMantenimientoRow();
      if (nuevo === 'servicio' && !fd.servicios.length) addServicioRow();
    },
  );

  /* ------------- API pública del composable ------------------- */
  return {
    operaciones,
    loading, // Loading state for the list of operations
    total,
    currentPage,
    pageSize,
    load: loadOperaciones,
    setPage,
    filtros,
    aplicarFiltros,

    // Form-related properties and actions
    formData,
    formLoading, // Loading state for the form submission
    resetForm,
    submitForm, // This will call the 'create' function internally

    // CRUD operations
    create: submitForm, // 'submitForm' from useFormActions will now call our 'create' function
    update,
    remove,
    editOperacion,

    // Sub-composable actions and computed properties
    addCombustibleRow,
    removeCombustibleRow,
    addMantenimientoRow,
    removeMantenimientoRow,
    ...mant,
    addServicioRow,
    removeServicioRow,

    costoTotalCombustible,
    costoTotalServicio,
    costoTotal,
  };
}