import { ref, watch, Ref, nextTick } from 'vue';
import api from '@/services/authService';

import { useCombustible }   from '@/composables/operaciones/useCombustible';
import { useMantenimiento } from '@/composables/operaciones/useMantenimiento';
import { useServicio }      from '@/composables/operaciones/useServicio';
import { useFormActions }   from '@/composables/global/useFormActions';
import { useNotify }        from '@/composables/global/useNotify';
import { stripTempIds }     from '@/utils/payload';
import { validateRequired } from '@/utils/validateRequired';

import {
  makeOperacionDefaults,
  type Operacion,
  type TipoOperacion,
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

  // Mensaje global genérico
  return validateRequired(p, required);
}

export function useOpForm() {
  /* ---------------- estado base ---------------- */
  const isResetting = ref(false);
  const defaults = makeOperacionDefaults();
  const { success, error, info } = useNotify();

  /* ----------- submit → backend ---------------- */
  const onSubmitService = async (payload: Partial<Operacion>) => {
    /* --- VALIDACIÓN --- */
    const validationMsg = validateOperacion(payload);
    if (validationMsg) {
      error(validationMsg);
      throw new Error(validationMsg);          // evita reset en caso de fallo
    }

    /**
     * Aseguramos valores por defecto (arrays vacíos) con merge.
     * Esto evita undefined en stripTempIds
     */
    const merged: Operacion = { ...defaults, ...payload };

    /* --- CONSTRUCCIÓN DTO --- */
    const dto: OpDTO = {
      ...merged,
      combustible_detalle   : stripTempIds(merged.combustibles),
      mantenimiento_detalle : stripTempIds(merged.mantenimientos),
      servicio_detalle      : stripTempIds(merged.servicios),
    };

    // Eliminamos arrays originales y costo_total
    delete (dto as any).combustibles;
    delete (dto as any).mantenimientos;
    delete (dto as any).servicios;
    delete (dto as any).costo_total;

    await api.post('operaciones/', dto);
    success('Operación registrada correctamente');
  };

  /* ------------ acciones genéricas ------------- */
  const {
    formData,
    loading,
    resetForm: baseReset,
    submitForm,
  } = useFormActions<Operacion>({
    defaults,
    onSubmitService,
    onResetCallback: () => info('Formulario limpiado'),
  });

  const resetForm = async () => {
    isResetting.value = true;
    await baseReset();
    await nextTick();
    isResetting.value = false;
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

      if (nuevo !== 'combustible')   descartar('combustibles',   'Descartado combustible');
      if (nuevo !== 'mantenimiento') descartar('mantenimientos', 'Descartado mantenimiento');
      if (nuevo !== 'servicio')      descartar('servicios',      'Descartado servicio');

      if (nuevo === 'combustible'   && !fd.combustibles.length)   addCombustibleRow();
      if (nuevo === 'mantenimiento' && !fd.mantenimientos.length) addMantenimientoRow();
      if (nuevo === 'servicio'      && !fd.servicios.length)      addServicioRow();
    },
  );

  /* ------------- API pública ------------------- */
  return {
    formData,
    loading,

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

    resetForm,
    submitForm,
  };
}