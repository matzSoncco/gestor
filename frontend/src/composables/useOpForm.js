import { watch } from 'vue';
import api from '../services/api.js';

import { useCombustible } from './useCombustible.js';
import { useMantenimiento } from './useMantenimiento.js';
import { useServicio } from './useServicio.js';
import { useFormActions } from './useFormActions.js';
import { useNotificacion } from './useNotificacion.js';
import useMensajeGlobal from './useMensajeGlobal.js';

export function useOpForm() {
    const defaults = {
        numero_documento: '',
        ruc_proveedor: '',
        nombre_proveedor: '',
        tipo_operacion: '',
        fecha: '',
        descripcion: '',
        costo_total: 0,
        combustibles: [],
        mantenimientos: [],
        servicios: [],
    };

    const { mostrarNotificacion } = useNotificacion();
    
    const onSubmitService = async (payload) => {
        // Función para limpiar IDs temporales de los arrays
        const limpiarArray = (array) => {
            return array.map(item => {
                // Crear copia del item sin el ID temporal
                const { id, ...itemLimpio } = item;
                
                // Solo conservar el ID si es un número (ID real de BD)
                if (typeof id === 'number' && id > 0) {
                    itemLimpio.id = id;
                }
                
                return itemLimpio;
            });
        };

        const dto = {
            ...payload,
            combustible_detalle: limpiarArray(payload.combustibles || []),
            mantenimiento_detalle: limpiarArray(payload.mantenimientos || []),
            servicio_detalle: limpiarArray(payload.servicios || []),
        }

        delete dto.combustibles;
        delete dto.mantenimientos;
        delete dto.servicios;
        delete dto.costo_total; // No enviar costo_total, se calcula en el backend

        try {
            await api.post('operaciones/', dto);

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
    } = useFormActions({ defaults, onSubmitService, extraComputed: {} });

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

    const {
        mensajeGlobal,
        tipoMensajeGlobal,
        modalVisible,
        mostrarMensaje,
        cerrarMensaje
    } = useMensajeGlobal();

    watch(
        () => formDataRefAcciones.value.tipo_operacion,
        nuevoTipo => {
        const fd = formDataRefAcciones.value;

        // Si cambiamos fuera de combustible y había datos, los borramos
        if (nuevoTipo !== 'combustible' && fd.combustibles.length) {
            fd.combustibles = [];
            mostrarMensaje('Se han descartado los datos de Combustible.', 'error');
        }
        // Si cambiamos fuera de mantenimiento y había datos, los borramos
        if (nuevoTipo !== 'mantenimiento' && fd.mantenimientos.length) {
            fd.mantenimientos = [];
            mostrarMensaje('Se han descartado los datos de Mantenimiento.', 'error');
        }
        // Si cambiamos fuera de servicio y había datos, los borramos
        if (nuevoTipo !== 'servicio' && fd.servicios.length) {
            fd.servicios = [];
            mostrarMensaje('Se han descartado los datos de Servicio.', 'error');
        }

        // Luego, inicializamos la fila del tipo seleccionado (si está vacío)
        if (nuevoTipo === 'combustible' && !fd.combustibles.length) {
            addCombustibleRow();
        } else if (nuevoTipo === 'mantenimiento' && !fd.mantenimientos.length) {
            addMantenimientoRow();
        } else if (nuevoTipo === 'servicio' && !fd.servicios.length) {
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