import { reactive, ref, watch } from 'vue';
import apiService from '../services/apiService';

import { useCombustible } from './useCombustible.js';
import { useMantenimiento } from './useMantenimiento.js';
import { useServicio } from './useServicio.js';
import { useFormActions } from './useFormActions.js';

export function useOpForm() {
    const formData = reactive({
        numeroDocumento: '',
        rucProveedor: '',
        nombreProveedor: '',
        tipoOperacion: '',
        fecha: '',
        descripcion: '',
        combustibles: [],
        mantenimientos: [],
        servicios: [],
    });

    //Sub composables
    const {
        addCombustibleRow,
        removeCombustibleRow,
        costoTotalCombustible,
    } = useCombustible(formData);

    const {
        addMantenimientoRow,
        removeMantenimientoRow,
        updateSugerencias,
        selectItem,
        blurHandler,
        sugerencias,
        inputActivo,
        updateSubtotal,
        costoTotal
    } = useMantenimiento(formData);

    const {
        addServicioRow,
        removeServicioRow,
        costoTotalServicio,
    } = useServicio(formData);

    watch(
        () => formData.tipoOperacion,
        tipo => {
            if (tipo === 'combustible' && formData.combustibles.length === 0) {
                addCombustibleRow();
            } else if (tipo === 'mantenimiento' && formData.mantenimientos.length === 0) {
                addMantenimientoRow();
            } else if (tipo === 'servicio' && formData.servicios.length === 0) {
                addServicioRow();
            }
        }
    );

    const defaults = {
        numeroDocumento: '',
        rucProveedor: '',
        nombreProveedor: '',
        // mantenemos tipoOperacion
        fecha: '',
        descripcion: '',
        combustibles: [],
        mantenimientos: [],
        servicios: [],
    }

    const {
        loading,
        mensaje,
        tipoMensaje,
        resetForm,
        submitForm,
    } = useFormActions({
        formDataRef: formData,
        defaults,
        onSubmitService: async (data) => {
            try {
                await apiService.post('/operaciones', data);
                mostraNotificacion('Operación exitosa', 'success');
                resetForm();
            } catch (error) {
                mostraNotificacion('Error al guardar los datos', 'error');
            }
        },
        extraComputed: {
            costoTotalCombustible,
            costoTotalServicio,
            costoTotal,
        }
    });

    return {
        formData,
        loading,
        mensaje,
        tipoMensaje,

        addCombustibleRow,
        removeCombustibleRow,

        addMantenimientoRow,
        removeMantenimientoRow,
        updateSugerencias,
        selectItem,
        blurHandler,
        sugerencias,
        inputActivo,
        updateSubtotal,
        costoTotalCombustible,
        costoTotalServicio,
        costoTotal,

        addServicioRow,
        removeServicioRow,

        resetForm,
        submitForm
    }
}