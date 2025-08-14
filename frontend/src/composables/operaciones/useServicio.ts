import { computed, Ref, watch } from 'vue';
import { useIdGenerator } from '@/composables/global/useIdGenerator';
import type { Servicio } from '@/types/operacion';

interface OperacionLike {
  servicio_detalle: Servicio[];
}

export function useServicio(formDataRef: Ref<OperacionLike>) {
  const { generateId } = useIdGenerator();

  const addServicioRow = (): void => {
    formDataRef.value.servicio_detalle.push({
      id: generateId(),
      descripcion_item: '',
      subtotal: 0,
      igv: 0,
      total: 0,
      placa_vehiculo: '',
    });
  };

  const removeServicioRow = (id: string | number): void => {
    formDataRef.value.servicio_detalle = formDataRef.value.servicio_detalle.filter(
      (s) => s.id !== id
    )
  };

  const updateSubtotals = (): void => {
    formDataRef.value.servicio_detalle.forEach((s) => {
      s.igv = Number((s.subtotal * 0.18).toFixed(2));
      s.total = Number((s.subtotal + s.igv).toFixed(2))
    })
  }

  const costoTotalServicio = computed(() =>
    Number(
      formDataRef.value.servicio_detalle.reduce(
        (s, i) => s + (i.total || 0),
        0,
      ).toFixed(2),
    ),
  );

  watch(
    () => formDataRef.value.servicio_detalle,
    updateSubtotals,
    { deep: true }
  );

  return {
    addServicioRow,
    removeServicioRow,
    costoTotalServicio,
    updateSubtotals,
  };
}