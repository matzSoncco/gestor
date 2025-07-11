import { ref, watch, computed } from 'vue';
import { useIdGenerator } from '../global/useIdGenerator';

export function useMantenimiento (formDataRef) {
    const { generateId } = useIdGenerator();

    const itemsConocidos = ref([
        'Filtro de aceite',
        'Llantas',
        'Pastillas de freno',
        'Cambio de aceite',
        'Alineamiento y Balanceo',
        'Cambio de bujías',
        'Cambio de líquido de frenos',
        'Cambio de líquido refrigerante',
        'Cambio de filtro de aire',
        'Cambio de filtro de combustible',
        'Cambio de batería',
        'Cambio de correa de distribución',
        'Cambio de aceite de transmisión',
        'Cambio de líquido de dirección asistida',
        'Cambio de pastillas de freno',
        'Cambio de discos de freno',
        'Cambio de amortiguadores',
    ]);

    const sugerencias = ref([]);
    const inputActivo = ref(null);

    const addMantenimientoRow = () => {
        formDataRef.value.mantenimientos.push({
            id: generateId(),
            descripcion_item: '',
            cantidad: null,
            costo_unitario: null,
            subtotal: 0,
            placa_vehiculo: null,
        });
    };

    const removeMantenimientoRow = (id) => {
        formDataRef.value.mantenimientos = formDataRef.value.mantenimientos.filter(item => item.id !== id);
    };

    const updateSugerencias = (text, rowIndex) => {
        const query = typeof text === 'string' ? text.toLowerCase() : '';
        sugerencias.value = query ? itemsConocidos.value.filter(item => item.toLowerCase().includes(query)) : [];
        inputActivo.value = rowIndex;
    };

    const selectItem = (item, rowIndex) => {
        formDataRef.value.mantenimientos[rowIndex].descripcion_item = item;
        sugerencias.value = [];
        inputActivo.value = null;
    };

    const blurHandler = () => {
        setTimeout(() => {
            sugerencias.value = [];
            inputActivo.value = null;
        }, 200);
    }

    const updateSubtotal = () => {
        formDataRef.value.mantenimientos.forEach((item) => {
            const cantidad = parseFloat(item.cantidad) || 0;
            const costo = parseFloat(item.costo_unitario) || 0;
            item.subtotal = parseFloat((cantidad * costo).toFixed(2));
        });
    };
    watch(() => formDataRef.value.mantenimientos, updateSubtotal, { deep: true });

    const costoTotal = computed(() => {
        return parseFloat(
            formDataRef.value.mantenimientos.reduce((sum, item) => sum + (item.subtotal || 0), 0).toFixed(2)
        );
    });

    return {
        addMantenimientoRow,
        removeMantenimientoRow,
        updateSugerencias,
        selectItem,
        blurHandler,
        sugerencias,
        inputActivo,
        updateSubtotal,
        costoTotal
    };
}