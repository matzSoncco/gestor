import { ref, watch, computed } from 'vue';
import { useIdGenerator } from './useIdGenerator.js';

export function useMantenimiento (formData) {
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
        formData.mantenimientos.push({
            id: generateId(),
            descripcionItem: '',
            cantidad: null,
            costoUnitario: null,
            subtotalItem: 0,
        });
    };

    const removeMantenimientoRow = (id) => {
        formData.mantenimientos = formData.mantenimientos.filter(item => item.id !== id);
    };

    const updateSugerencias = (text, rowIndex) => {
        const query = typeof text === 'string' ? text.toLowerCase() : '';
        sugerencias.value = query ? itemsConocidos.value.filter(item => item.toLowerCase().includes(query)) : [];
        inputActivo.value = rowIndex;
    }

    const selectItem = (item, rowIndex) => {
        formData.mantenimientos[rowIndex].descripcionItem = item;
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
        formData.mantenimientos.forEach(item => {
            const cantidad = parseFloat(item.cantidad) || 0;
            const costo = parseFloat(item.costoUnitario) || 0;
            item.subtotalItem = parseFloat((cantidad * costo).toFixed(2));
        });
    };
    watch(() => formData.mantenimientos, updateSubtotal, { deep: true });

    const costoTotal = computed(() =>
        parseFloat(formData.mantenimientos.reduce((sum, item) => sum + (item.subtotalItem || 0), 0).toFixed(2))
    );

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