import { computed, Ref } from 'vue';
import { useIdGenerator } from '@/composables/global/useIdGenerator';

/* ------------- Tipos ------------- */
interface ServicioRow {
  id: string | number;
  descripcion_item: string;
  costo_servicio: number | null;
}
interface OperacionLike {
  servicios: ServicioRow[];
}

export function useServicio(formDataRef: Ref<OperacionLike>) {
  const { generateId } = useIdGenerator();

  const addServicioRow = (): void => {
    formDataRef.value.servicios.push({
      id: generateId(),
      descripcion_item: '',
      costo_servicio: null,
    });
  };

  const removeServicioRow = (id: string | number): void => {
    formDataRef.value.servicios =
      formDataRef.value.servicios.filter((s) => s.id !== id);
  };

  const costoTotalServicio = computed(() =>
    Number(
      formDataRef.value.servicios.reduce(
        (s, i) => s + (i.costo_servicio || 0),
        0,
      ).toFixed(2),
    ),
  );

  return {
    addServicioRow,
    removeServicioRow,
    costoTotalServicio,
  };
}