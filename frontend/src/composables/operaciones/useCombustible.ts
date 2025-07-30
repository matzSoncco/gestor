import { watch, computed, Ref } from 'vue';
import { useIdGenerator }     from '@/composables/global/useIdGenerator';
import type { Combustible } from '@/types/operacion';

interface OperacionLike {
  combustibles: Combustible[];
}

export function useCombustible(formDataRef: Ref<OperacionLike>) {
  const { generateId } = useIdGenerator();

  const addCombustibleRow = (): void => {
    formDataRef.value.combustibles.push({
      id: generateId(),
      cantidad_galones: 0,
      costo_por_galon: 0,
      subtotal: 0,
      igv: 0,
      total: 0,
      placa_vehiculo: '',
      ubicacion: 'AREQUIPA',
    });
  };

  const removeCombustibleRow = (id: string | number): void => {
    formDataRef.value.combustibles = formDataRef.value.combustibles.filter(
      (c) => c.id !== id
    );
  };

    /** Recalcula subtotal, IGV y total para cada fila */
  const updateSubtotals = (): void => {
    formDataRef.value.combustibles.forEach((c) => {
      const cantidad = Number(c.cantidad_galones) || 0;
      const precio = Number(c.costo_por_galon) || 0;

      c.subtotal = Number((cantidad * precio).toFixed(2));
      c.igv = Number((c.subtotal * 0.18).toFixed(2));
      c.total = Number((c.subtotal + c.igv).toFixed(2));
    });
  };

  /** Calcula el total acumulado de todos los ítems */
  const costoTotalCombustible = computed(() =>
    Number(
      formDataRef.value.combustibles.reduce(
        (s, i) => s + (i.total ?? 0),
        0
      ).toFixed(2)
    )
  );

  watch(
    () => formDataRef.value.combustibles,
    updateSubtotals,
    { deep: true },
  );

  return {
    addCombustibleRow,
    removeCombustibleRow,
    costoTotalCombustible,
  };
}