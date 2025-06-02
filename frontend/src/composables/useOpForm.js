import { watch } from 'vue';
import api from '../services/api.js';

import { useCombustible } from './useCombustible.js';
import { useMantenimiento } from './useMantenimiento.js';
import { useServicio } from './useServicio.js';
import { useFormActions } from './useFormActions.js';
import { useNotificacion } from './useNotificacion.js';

export function useOpForm() {
    const defaults = {
        numeroDocumento: '',
        rucProveedor: '',
        nombreProveedor: '',
        tipoOperacion: '',
        fecha: '',
        descripcion: '',
        combustibles: [],
        mantenimientos: [],
        servicios: [],
    };

    const { mostrarNotificacion } = useNotificacion();
    
    const onSubmitService = async (payload) => {
        //const { data } = await api.post('operaciones/', payload);
        try {
            await api.post('operaciones/', payload);

            mostrarNotificacion('Operación exitosa', 'success');
            resetForm();
        } catch (error) {
            // El error ahora debería ser un 400 (Bad Request) con detalles, no un 500.
            if (error.response) {
                console.error('Error del servidor:', error.response.data);
                // Aquí puedes mostrar los errores de validación al usuario
                mostrarNotificacion('Error al registrar: ' + JSON.stringify(error.response.data), 'error');
            } else {
                console.error('Error de red o desconocido:', error);
                mostrarNotificacion('Ocurrió un error inesperado.', 'error');
            }
        }
    };

    // Primero inicializa useFormActions
    const {
        formData: formDataRefAcciones,
        loading,
        mensaje,
        tipoMensaje,
        resetForm,
        submitForm
    } = useFormActions({
        defaults,
        onSubmitService,
        extraComputed: {
            // estos se definen después
        }
    });

    // Ahora puedes pasar formDataRefAcciones.value a los sub-composables
    const {
        addCombustibleRow,
        removeCombustibleRow,
        costoTotalCombustible,
    } = useCombustible(formDataRefAcciones.value);

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
    } = useMantenimiento(formDataRefAcciones.value);

    const {
        addServicioRow,
        removeServicioRow,
        costoTotalServicio,
    } = useServicio(formDataRefAcciones.value);

    //inicializa al cambiar de operacion
    watch(
        () => formDataRefAcciones.value.tipoOperacion,
        tipo => {
            if (tipo === 'combustible' && formDataRefAcciones.value.combustibles.length === 0) {
                addCombustibleRow();
            } else if (tipo === 'mantenimiento' && formDataRefAcciones.value.mantenimientos.length === 0) {
                addMantenimientoRow();
            } else if (tipo === 'servicio' && formDataRefAcciones.value.servicios.length === 0) {
                addServicioRow();
            }
        }
    );

    return {
        formData: formDataRefAcciones,
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