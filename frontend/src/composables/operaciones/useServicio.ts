import { computed, Ref, watch } from 'vue';
import { useIdGenerator } from '@/composables/global/useIdGenerator';
import type { Servicio } from '@/types/operacion';

interface OperacionLike {
  servicios: Servicio[];
}

export function useServicio(formDataRef: Ref<OperacionLike>) {
  const { generateId } = useIdGenerator();

  const addServicioRow = (): void => {
    formDataRef.value.servicios.push({
      id: generateId(),
      descripcion_item: '',
      subtotal: 0,
      igv: 0,
      total: 0,
      placa_vehiculo: '',
    });
  };

  const removeServicioRow = (id: string | number): void => {
    formDataRef.value.servicios = formDataRef.value.servicios.filter(
      (s) => s.id !== id
    )
  };

  const updateSubtotals = (): void => {
    formDataRef.value.servicios.forEach((s) => {
      s.igv = Number((s.subtotal * 0.18).toFixed(2));
      s.total = Number((s.subtotal + s.igv).toFixed(2))
    })
  }

  const costoTotalServicio = computed(() =>
    Number(
      formDataRef.value.servicios.reduce(
        (s, i) => s + (i.total || 0),
        0,
      ).toFixed(2),
    ),
  );

  watch(
    () => formDataRef.value.servicios,
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