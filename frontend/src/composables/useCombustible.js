import { watch, computed } from "vue";
import { useIdGenerator } from "./useIdGenerator.js";

export function useCombustible(formData) {
    const { generateId } = useIdGenerator();
    
    // --- Lógica para Combustible ---
    const addCombustibleRow = () => {
        formData.combustibles.push({
        id: generateId(),
        cantidadGalones: null,
        costoPorGalon: null,
        subtotal: 0,
        placaVehiculo: null,
        });
    };
    
    const removeCombustibleRow = (id) => {
        formData.combustibles = formData.combustibles.filter((c) => c.id !== id);
    };
    
    const updateTotalCombustible = () => {
        formData.combustibles.forEach((c) => {
        const cantidad = parseFloat(c.cantidadGalones) || 0;
        const costo = parseFloat(c.costoPorGalon) || 0;
        c.subtotal = parseFloat((cantidad * costo).toFixed(2));
        });
    };
    watch(() => formData.combustibles, updateTotalCombustible, { deep: true });
    
    const costoTotalCombustible = computed(() => {
        return parseFloat(
            formData.combustibles.reduce((sum, c) => sum + (c.subtotal || 0), 0).toFixed(2)
        );
    });
    
    return {
        addCombustibleRow,
        removeCombustibleRow,
        costoTotalCombustible,
    };
}