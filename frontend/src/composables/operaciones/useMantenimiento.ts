import { ref, watch, computed, Ref } from 'vue';
import { fetchRepuestosByQuery } from '@/api/repuestos';
import { useIdGenerator } from '@/composables/global/useIdGenerator';
import { SugerenciaItem } from '@/types/operacion';
import debounce from 'lodash.debounce';

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

    sugerencias.value.push([])
  };

  const removeMantenimientoRow = (id: string | number): void => {
    const idx = formDataRef.value.mantenimientos.findIndex((m) => m.id === id)
    if (idx !== -1) {
      formDataRef.value.mantenimientos.splice(idx, 1)
      sugerencias.value.splice(idx, 1) // 🔥 mantenemos sincronía
    }
  }

  /* ---- autocompletado ---- */
  const updateSugerencias = debounce(async (text: string, rowIdx: number) => {
    inputActivo.value = rowIdx

    if (!text || text.length < 2) {
      sugerencias.value[rowIdx] = []
      return
    }

    try {
      const data = await fetchRepuestosByQuery(text)
      sugerencias.value[rowIdx] = data.results.map((item: any) => ({
        label: item.descripcion,
        value: item.descripcion
      }))
    } catch (err) {
      console.error('Error buscando sugerencias:', err)
      sugerencias.value[rowIdx] = []
    }
  }, 300)

  const selectItem = (item: SugerenciaItem, index: number): void => {
    formDataRef.value.mantenimientos[index].repuesto = item.value
    sugerencias.value[index] = []
    inputActivo.value = null
  }

  const blurHandler = (index: number): void => {
    setTimeout(() => {
      sugerencias.value[index] = []
      inputActivo.value = null
    }, 200)
  }

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