import { watch, computed } from "vue";
import { useIdGenerator } from "../global/useIdGenerator";

export function useCombustible(formDataRef) {
    const { generateId } = useIdGenerator();
    
    const addCombustibleRow = () => {
        formDataRef.value.combustibles.push({
            id: generateId(),
            cantidad_galones: null,
            costo_por_galon: null,
            subtotal: 0,
            placa_vehiculo: null,
        });
    };
    
    const removeCombustibleRow = (id) => {
        formDataRef.value.combustibles = formDataRef.value.combustibles.filter((item) => item.id !== id);
    };
    
    const updateSubtotals = () => {
        formDataRef.value.combustibles.forEach((c) => {
            const cantidad = parseFloat(c.cantidad_galones) || 0;
            const costo = parseFloat(c.costo_por_galon) || 0;
            c.subtotal = parseFloat((cantidad * costo).toFixed(2));
        });
    };
    watch(() => formDataRef.value.combustibles, updateSubtotals, { deep: true });
    
    const costoTotalCombustible = computed(() => {
        return parseFloat(
            formDataRef.value.combustibles.reduce((sum, item) => sum + (item.subtotal || 0), 0).toFixed(2)
        );
    });
    
    return {
        addCombustibleRow,
        removeCombustibleRow,
        costoTotalCombustible,
    };
}