import { watch, computed } from "vue";
import { useIdGenerator } from "./useIdGenerator.js";

export function useCombustible(formData) {
    const { generateId } = useIdGenerator();
    
    // --- Lógica para Combustible ---
    const addCombustibleRow = () => {
        formData.combustibles.push({
        id: generateId(),
        cantidad_galones: null,
        costo_por_galon: null,
        subtotal: 0,
        placa_vehiculo: null,
        });
    };
    
    const removeCombustibleRow = (id) => {
        formData.combustibles = formData.combustibles.filter((item) => item.id !== id);
    };
    
    const updateSubtotals = () => {
        formData.combustibles.forEach((c) => {
        const cantidad = parseFloat(c.cantidad_galones) || 0;
        const costo = parseFloat(c.costo_por_galon) || 0;
        c.subtotal = parseFloat((cantidad * costo).toFixed(2));
        });
    };
    watch(() => formData.combustibles, updateSubtotals, { deep: true });
    
    const costoTotalCombustible = computed(() => {
        return parseFloat(
            formData.combustibles.reduce((sum, item) => sum + (item.subtotal || 0), 0).toFixed(2)
        );
    });
    
    return {
        addCombustibleRow,
        removeCombustibleRow,
        costoTotalCombustible,
    };
}