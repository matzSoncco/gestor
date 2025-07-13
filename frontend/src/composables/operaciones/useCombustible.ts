import { watch, computed, Ref } from 'vue';
import { useIdGenerator }     from '@/composables/global/useIdGenerator';

/* ------------- Tipos internos ------------- */
interface CombustibleRow {
  id: string | number;
  cantidad_galones: number | null;
  costo_por_galon: number | null;
  subtotal: number;
  placa_vehiculo: string | null;
}

interface OperacionLike {
  combustibles: CombustibleRow[];
  // resto de propiedades no las usamos aquí
}

export function useCombustible(formDataRef: Ref<OperacionLike>) {
  const { generateId } = useIdGenerator();

  /* -------- acciones de array -------- */
  const addCombustibleRow = (): void => {
    formDataRef.value.combustibles.push({
      id: generateId(),
      cantidad_galones: null,
      costo_por_galon: null,
      subtotal: 0,
      placa_vehiculo: null,
    });
  };

  const removeCombustibleRow = (id: string | number): void => {
    formDataRef.value.combustibles =
      formDataRef.value.combustibles.filter((c) => c.id !== id);
  };

  /* ---- calcular subtotales reactivos ---- */
  const updateSubtotals = (): void => {
    formDataRef.value.combustibles.forEach((c) => {
      const cantidad = Number(c.cantidad_galones) || 0;
      const costo    = Number(c.costo_por_galon)  || 0;
      c.subtotal = Number((cantidad * costo).toFixed(2));
    });
  };

  watch(
    () => formDataRef.value.combustibles,
    updateSubtotals,
    { deep: true },
  );

  const costoTotalCombustible = computed(() =>
    Number(
      formDataRef.value.combustibles.reduce(
        (s, i) => s + (i.subtotal || 0),
        0,
      ).toFixed(2),
    ),
  );

  /* -------- API pública -------- */
  return {
    addCombustibleRow,
    removeCombustibleRow,
    costoTotalCombustible,
  };
}