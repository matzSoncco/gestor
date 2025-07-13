import { ref, watch, computed, Ref } from 'vue';
import { useIdGenerator }            from '@/composables/global/useIdGenerator';

/* ------------- Tipos ------------- */
interface MantRow {
  id: string | number;
  descripcion_item: string;
  cantidad: number | null;
  costo_unitario: number | null;
  subtotal: number;
  placa_vehiculo: string | null;
}
interface OperacionLike {
  mantenimientos: MantRow[];
}

export function useMantenimiento(formDataRef: Ref<OperacionLike>) {
  const { generateId } = useIdGenerator();

  /* ----- data local ----- */
  const itemsConocidos = ref<string[]>([
    'Filtro de aceite', 'Llantas', 'Pastillas de freno',
    'Cambio de aceite', 'Alineamiento y Balanceo',
    // … el resto
  ]);

  const sugerencias = ref<string[]>([]);
  const inputActivo = ref<number | null>(null);

  /* ---- acciones array ---- */
  const addMantenimientoRow = (): void => {
    formDataRef.value.mantenimientos.push({
      id: generateId(),
      descripcion_item: '',
      cantidad: null,
      costo_unitario: null,
      subtotal: 0,
      placa_vehiculo: null,
    });
  };

  const removeMantenimientoRow = (id: string | number): void => {
    formDataRef.value.mantenimientos =
      formDataRef.value.mantenimientos.filter((m) => m.id !== id);
  };

  /* ---- autocompletado ---- */
  const updateSugerencias = (text: unknown, rowIdx: number): void => {
    const q = typeof text === 'string' ? text.toLowerCase() : '';
    sugerencias.value = q
      ? itemsConocidos.value.filter((i) => i.toLowerCase().includes(q))
      : [];
    inputActivo.value = rowIdx;
  };
  const selectItem = (item: string, rowIdx: number): void => {
    formDataRef.value.mantenimientos[rowIdx].descripcion_item = item;
    sugerencias.value = [];
    inputActivo.value = null;
  };
  const blurHandler = (): void => {
    setTimeout(() => {
      sugerencias.value = [];
      inputActivo.value = null;
    }, 200);
  };

  /* ---- subtotales y total ---- */
  const updateSubtotal = (): void => {
    formDataRef.value.mantenimientos.forEach((m) => {
      const c = Number(m.cantidad)       || 0;
      const u = Number(m.costo_unitario) || 0;
      m.subtotal = Number((c * u).toFixed(2));
    });
  };

  watch(
    () => formDataRef.value.mantenimientos,
    updateSubtotal,
    { deep: true },
  );

  const costoTotal = computed(() =>
    Number(
      formDataRef.value.mantenimientos.reduce(
        (s, i) => s + (i.subtotal || 0),
        0,
      ).toFixed(2),
    ),
  );

  /* ---- API ---- */
  return {
    addMantenimientoRow,
    removeMantenimientoRow,
    updateSugerencias,
    selectItem,
    blurHandler,
    sugerencias,
    inputActivo,
    updateSubtotal,
    costoTotal,
  };
}