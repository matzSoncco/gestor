import { computed } from "vue";
import { useIdGenerator } from "./useIdGenerator.js";

export function useServicio(formData) {
    const { generateId } = useIdGenerator();

    const addServicioRow = () => {
        formData.servicios.push({
            id: generateId(),
            descripcionServicio: '',
            costoServicio: null,
        });
    };

    const removeServicioRow = (id) => {
        formData.servicios = formData.servicios.filter(item => item.id !== id);
    };

    const costoTotalServicio = computed(() => {
        return parseFloat(formData.servicios.reduce((sum, c) => sum + (c.costoServicio || 0), 0).toFixed(2));
    });

    return {
        addServicioRow,
        removeServicioRow,
        costoTotalServicio,
    };
}