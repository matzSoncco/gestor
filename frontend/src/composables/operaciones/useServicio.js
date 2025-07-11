import { computed } from "vue";
import { useIdGenerator } from "../global/useIdGenerator";

export function useServicio(formDataRef) {
    const { generateId } = useIdGenerator();

    const addServicioRow = () => {
        formDataRef.value.servicios.push({
            id: generateId(),
            descripcion_item: '',
            costo_servicio: null,
        });
    };

    const removeServicioRow = (id) => {
        formDataRef.value.servicios = formDataRef.value.servicios.filter(item => item.id !== id);
    };

    const costoTotalServicio = computed(() => {
        return parseFloat(
            formDataRef.value.servicios.reduce((sum, c) => sum + (c.costo_servicio || 0), 0).toFixed(2)
        );
    });

    return {
        addServicioRow,
        removeServicioRow,
        costoTotalServicio,
    };
}