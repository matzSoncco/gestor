import { ref, watch, nextTick, Ref } from 'vue';
import api from '@/services/api';

import { useCombustible }   from '@/composables/operaciones/useCombustible';
import { useMantenimiento } from '@/composables/operaciones/useMantenimiento';
import { useServicio }      from '@/composables/operaciones/useServicio';
import { useFormActions }   from '@/composables/global/useFormActions';
import { useNotification } from 'naive-ui';
import {
  makeOperacionDefaults,
  type Operacion,
} from '@/types/operacion';

export function useOpForm() {
  /* ---------------- estado base ---------------- */
  const isResetting = ref(false);
  const defaults: Operacion = makeOperacionDefaults();
  const notification = useNotification();

  /* ----------- submit → backend ---------------- */
  const onSubmitService = async (payload: Partial<Operacion>) => {
    /* limpia ids temporales */
    const limpiarArray = <T extends { id?: unknown }>(arr: T[]) =>
      arr.map(({ id, ...rest }) =>
        typeof id === 'number' && id > 0 ? ({ id, ...rest }) : rest,
      );

    const dto = {
      ...payload,
      combustible_detalle   : limpiarArray(payload.combustibles     ?? []),
      mantenimiento_detalle : limpiarArray(payload.mantenimientos   ?? []),
      servicio_detalle      : limpiarArray(payload.servicios        ?? []),
    };

    delete (dto as any).combustibles;
    delete (dto as any).mantenimientos;
    delete (dto as any).servicios;
    delete (dto as any).costo_total;

    try {
      await api.post('operaciones/', dto);
      notification.success({title: 'Bien', description: 'Operación registrada con éxito'});
      resetForm();
      nextTick(() => { isResetting.value = false; });
    } catch (err: any) {
      const msg = err?.response?.data
        ? JSON.stringify(err.response.data)
        : 'Ocurrió un error inesperado.';
      console.error('[useOpForm] submit error', err);
      notification.error({title: 'Error', description: msg});
    }
  };

  /* ------------ acciones genéricas ------------- */
  const {
    formData,        // Ref<Operacion>
    loading,
    resetForm: baseReset,
    submitForm,
  } = useFormActions<Operacion>({
    defaults,
    onSubmitService,
  });

  const resetForm = async () => {
    await baseReset();
    notification.info({title: 'Formulario', description: 'Formulario limpiado correctamente'});
  };

  /* ------ sub-composables por sección ---------- */
  const { addCombustibleRow, removeCombustibleRow, costoTotalCombustible } =
    useCombustible(formData as Ref<Operacion>);

  const { addMantenimientoRow, removeMantenimientoRow, costoTotal, ...mant } =
    useMantenimiento(formData as Ref<Operacion>);

  const { addServicioRow, removeServicioRow, costoTotalServicio } =
    useServicio(formData as Ref<Operacion>);

  /* ------------- watcher de tipo --------------- */
  watch(
    () => formData.value.tipo_operacion,
    (nuevo, viejo) => {
      if (isResetting.value || nuevo === viejo) return;
      const fd = formData.value;

      const descartar = (campo: keyof Operacion, msg: string) => {
        // @ts-ignore - campos de arrays
        if (fd[campo].length) {
          // @ts-ignore
          fd[campo] = [];
          notification.info({title: 'Cambios', description: msg});
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
    ...mant, // sugerencias, inputActivo, etc.

    addServicioRow,
    removeServicioRow,

    costoTotalCombustible,
    costoTotalServicio,
    costoTotal,

    resetForm,
    submitForm,
  };
}