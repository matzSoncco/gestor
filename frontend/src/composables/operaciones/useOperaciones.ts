import { ref, computed, watch, nextTick, type Ref } from 'vue';
import { useCombustible } from '@/composables/operaciones/useCombustible';
import { useMantenimiento } from '@/composables/operaciones/useMantenimiento';
import { useServicio } from '@/composables/operaciones/useServicio';
import { useFormActions } from '@/composables/global/useFormActions';
import { useNotify } from '@/composables/global/useNotify';
import { useOperacionStore } from '@/stores/operacionStore';
import { usePagination } from '../global/usePagination';
import { handleApiError } from '@/utils/apiErrorHandler';
import {
  FIELD_NAMES_BASE,
  FIELD_NAMES_COMBUSTIBLE,
  FIELD_NAMES_MANTENIMIENTO,
  FIELD_NAMES_SERVICIO,
  mergeFieldNames,
} from "@/types/fieldNames";

import {
  fetchOperaciones,
  createOperacion,
  updateOperacion,
  deleteOperacion,
  mapOperacionRequest,
} from '@/api/operaciones';

import {
  Combustible,
  Mantenimiento,
  Servicio,
  makeOperacionDefaults,
  type Operacion,
} from '@/types/operacion';

/* ------------ Tipo auxiliar DTO sin campos temporales ------------ */
type OperacionFiltros = {
  numero_documento: string;
  fecha_inicio: string | null;
  fecha_fin: string | null;
};

export function useOperaciones() {
  const operacionStore = useOperacionStore()
  const defaults = makeOperacionDefaults();
  const formErrors = ref<Record<string, string[]>>({});
  const clearErrors = () => {
    formErrors.value = {};
  };

  const currentFieldNames = computed(() => {
    const tipo = formData.value.tipo_operacion; // 'combustible' | 'mantenimiento' | 'servicio'
    switch (tipo) {
      case "combustible":
        return mergeFieldNames(FIELD_NAMES_BASE, FIELD_NAMES_COMBUSTIBLE);
      case "mantenimiento":
        return mergeFieldNames(FIELD_NAMES_BASE, FIELD_NAMES_MANTENIMIENTO);
      case "servicio":
        return mergeFieldNames(FIELD_NAMES_BASE, FIELD_NAMES_SERVICIO);
      default:
        return FIELD_NAMES_BASE;
    }
  });

  /* ----------------- VALIDACIÓN ----------------- */
  function validateOperacion(operacion: Partial<Operacion>): string | null {
    formErrors.value = {}; // limpiar errores previos

    // 1️⃣ Campos obligatorios tipo texto
    const requiredText: (keyof Operacion)[] = [
      'numero_documento',
      'ruc_proveedor',
      'nombre_proveedor',
      'tipo_operacion',
    ];

    for (const field of requiredText) {
      const val = operacion[field];
      if (!val || (typeof val === 'string' && !val.trim())) {
        formErrors.value[field] = [
          `El campo "${currentFieldNames.value[field] || field}" es obligatorio.`
        ];
      }
    }

    // 2️⃣ Campos de tipo number que no pueden ser 0 o nulos
    const requiredNumber: (keyof Operacion)[] = ['fecha']; // si quieres incluir más, agregalos
    for (const field of requiredNumber) {
      const val = operacion[field] as number | null | undefined;
      if (val == null || val <= 0) {
        formErrors.value[field] = [
          `El campo "${currentFieldNames.value[field] || field}" debe ser mayor a 0.`
        ];
      }
    }

    // 3️⃣ Validar fecha (fecha no posterior a hoy)
    if (operacion.fecha) {
      const fecha = new Date(operacion.fecha);
      const hoy = new Date();
      hoy.setHours(0, 0, 0, 0);
      if (fecha > hoy) {
        formErrors.value.fecha = [
          'La fecha de operación no puede ser posterior a hoy.'
        ];
      }
    }

    // 4️⃣ Validaciones según tipo de operación
    const detallesPorTipo: Record<string, keyof Operacion> = {
      combustible: 'combustible_detalle',
      mantenimiento: 'mantenimiento_detalle',
      servicio: 'servicio_detalle',
    };

    const detalleKey = detallesPorTipo[operacion.tipo_operacion ?? ''];
    if (detalleKey) {
      const detalle = operacion[detalleKey] as (Partial<Combustible | Mantenimiento | Servicio>[]) | undefined;
      if (!detalle || detalle.length === 0) {
        formErrors.value[detalleKey as string] = [
          `Debe agregar al menos un registro de ${operacion.tipo_operacion}.`
        ];
      } else {
        // 4a️⃣ Validar campos dentro de cada detalle
        detalle.forEach((item, index) => {
          Object.keys(item).forEach((subfield) => {
            const val = (item as any)[subfield];
            if (val === null || val === undefined || (typeof val === 'number' && val <= 0)) {
              const key = `${detalleKey}[${index}].${subfield}`;
              formErrors.value[key] = [
                `El campo "${currentFieldNames.value[subfield] || subfield}" tiene que ser mayor a 0.`
              ];
            }
            if (val == null || val === undefined || (typeof val === 'string' && !val.trim())) {
              const key = `${detalleKey}[${index}].${subfield}`;
              formErrors.value[key] = [
                `El campo "${currentFieldNames.value[subfield] || subfield}" es obligatorio.`
              ];

            }
          });
        });
      }
    }

    return Object.keys(formErrors.value).length > 0
      ? 'Corrige los errores en el formulario.'
      : null;
  }
  const { success, error, info, warning } = useNotify();

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
    pageSize: 10,
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
    // 1) Validación local
    const msg = validateOperacion(payload);
    if (msg) {
      error(msg);
      throw new Error(msg);
    }

    // 2) Subtotales según tipo
    switch (formData.value.tipo_operacion) {
      case "servicio":
      case "combustible":
        servicioComposable.updateSubtotals();
        break;
      case "mantenimiento":
        mantenimientoComposable.updateSubtotals();
        break;
    }

    // 3) DTO con fecha en formato correcto
    const dto = mapOperacionRequest(payload as Operacion);
    console.log("📤 Enviando DTO al backend:", JSON.stringify(dto, null, 2));


    try {
      const data = await createOperacion(dto);

      // 4) Estado local
      operaciones.value = [data, ...operaciones.value];
      operacionStore.agregarOperacion(data);

      success("Operación registrada correctamente");
      return data;
    } catch (err) {
      // ✅ Normalización centralizada con nombres por tipo
      const apiErr = handleApiError(err, {
        context: "operación",
        fieldNames: currentFieldNames.value,
      });

      // Mensaje principal
      error(apiErr.detail || "Ocurrió un error");

      // Errores por campo → pintar en el formulario
      if (apiErr.errors) {
        formErrors.value = apiErr.errors;

        const keys = Object.keys(apiErr.errors);
        if (keys.length > 1) {
          warning("Se encontraron errores en varios campos. Revísalos y corrige la información.");
        }

        // (Opcional) Focus/scroll al primer campo con error
        // focusFirstError(keys[0]);
      } else {
        clearErrors();
      }

      // Manejo por código
      switch (apiErr.code) {
        case "UNAUTHENTICATED":
          warning("Tu sesión ha expirado.");
          break;
        case "FORBIDDEN":
          error("No tienes permisos para crear operaciones.");
          break;
        case "SERVER_ERROR":
          error("Error temporal del servidor.");
          break;
      }

      throw apiErr;
    }
  };

  const updateOperacionAction = async (id: number, payload: Partial<Operacion>) => {
    const msg = validateOperacion(payload);
    if (msg) {
      error(msg);
      throw new Error(msg);
    }

    // 3) DTO con fecha en formato correcto
    const dto = mapOperacionRequest(payload as Operacion);

    try {
      const data = await updateOperacion(id, dto);
      updateOperacionInBothSources(data);
      success('Operación actualizada exitosamente');
      return data;
    } catch (err) {
      const message = handleApiError(err, 'No se pudo actualizar la operación');
      error(typeof message === 'string' ? message : (message?.toString?.() || 'Ocurrió un error'));
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
        limpiarDetalle('combustible_detalle', 'Registros de combustible descartados');
      }
      if (nuevoTipo !== 'mantenimiento') {
        limpiarDetalle('mantenimiento_detalle', 'Registros de mantenimiento descartados');
      }
      if (nuevoTipo !== 'servicio') {
        limpiarDetalle('servicio_detalle', 'Registros de servicio descartados');
      }

      // Agregar fila inicial para el nuevo tipo si no existe
      if (nuevoTipo === 'combustible' && formData.value.combustible_detalle.length === 0) {
        combustibleComposable.addCombustibleRow();
      }
      if (nuevoTipo === 'mantenimiento' && formData.value.mantenimiento_detalle.length === 0) {
        mantenimientoComposable.addMantenimientoRow();
      }
      if (nuevoTipo === 'servicio' && formData.value.servicio_detalle.length === 0) {
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
    formErrors,
    clearErrors,
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