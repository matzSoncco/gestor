import { ref, watch, computed, Ref } from 'vue';
import { fetchRepuestosByQuery } from '@/api/repuestos';
import { useIdGenerator } from '@/composables/global/useIdGenerator';
import { SugerenciaItem } from '@/types/operacion';
import debounce from 'lodash.debounce';
import type { Mantenimiento } from '@/types/operacion';
import { useNotify } from '@/composables/global/useNotify';

interface OperacionLike {
  mantenimientos: Mantenimiento[];
}

export function useMantenimiento(formDataRef: Ref<OperacionLike>) {
  const { generateId } = useIdGenerator();
  const { error } = useNotify()
  const sugerencias = ref<SugerenciaItem[][]>([])
  const inputActivo = ref<number | null>(null);

  /* ---- acciones array ---- */
  const addMantenimientoRow = (): void => {
    formDataRef.value.mantenimientos.push({
      id: generateId(),
      repuesto: '',
      cantidad: 0,
      costo_unitario: 0,
      subtotal: 0,
      igv: 0,
      total: 0,
      placa_vehiculo: 0,
    });

    sugerencias.value.push([])
  };

  const removeMantenimientoRow = (id: string | number): void => {
    formDataRef.value.mantenimientos = formDataRef.value.mantenimientos.filter(
      (m) => m.id !== id
    )
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
    } catch (err: any) {
      console.error('Error buscando sugerencias:', err)

      // Notificación visual
      error(
        err?.response?.data?.detail ||
        err?.message ||
        'No se pudieron cargar las sugerencias.'
      )

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
  const updateSubtotals = (): void => {
    formDataRef.value.mantenimientos.forEach((m) => {
      const cantidad = Number(m.cantidad) || 0;
      const precio = Number(m.costo_unitario) || 0;

      m.subtotal = Number((cantidad * precio).toFixed(2));
      m.igv = Number((m.subtotal * 0.18).toFixed(2));
      m.total = Number((m.subtotal + m.igv).toFixed(2))
    });
  };

  const costoTotalMantenimiento = computed(() =>
    Number(
      formDataRef.value.mantenimientos.reduce(
        (s, i) => s + (i.total ?? 0),
        0
      ).toFixed(2)
    )
  )

  watch(
    () => formDataRef.value.mantenimientos,
    updateSubtotals,
    { deep: true },
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
    updateSubtotals,
    costoTotalMantenimiento,
  };
}