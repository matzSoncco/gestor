import { ref, watch, computed, Ref } from 'vue';
import { fetchRepuestosByQuery } from '@/api/repuestos';
import { useIdGenerator } from '@/composables/global/useIdGenerator';
import { SugerenciaItem } from '@/types/operacion';

/* ------------- Tipos ------------- */
interface MantRow {
  id: string | number;
  repuesto: string;
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

  const sugerencias = ref<SugerenciaItem[][]>([])
  const inputActivo = ref<number | null>(null);

  /* ---- acciones array ---- */
  const addMantenimientoRow = (): void => {
    formDataRef.value.mantenimientos.push({
      id: generateId(),
      repuesto: '',
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
  const updateSugerencias = async (text: string, rowIdx: number) => {
    inputActivo.value = rowIdx
    if (!text || text.length < 2) {
      sugerencias.value = []
      return
    }

    try {
      const data = await fetchRepuestosByQuery(text)

      // 👇 Aquí está el cambio importante: accedemos a 'results'
      sugerencias.value = data.results.map((item: any) => item.descripcion)

    } catch (err) {
      console.error('Error al buscar repuestos:', err)
      sugerencias.value = []
    }
  };

  const selectItem = (item: SugerenciaItem, index: number): void => {
    formDataRef.value.mantenimientos[index].repuesto = item.value
    sugerencias.value[index] = []
    inputActivo.value = null
  }

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