import { ref, watch, nextTick } from 'vue';
import api from '../../services/api.js';

import { useCombustible } from '../operaciones/useCombustible.js';
import { useMantenimiento } from '../operaciones/useMantenimiento.js';
import { useServicio } from '../operaciones/useServicio.js';
import { useFormActions } from '../global/useFormActions.js';
import useMensajeGlobal from '../global/useMensajeGlobal.js';
import { makeOperacionDefaults } from '../../types/operacion.js';

export function useOpForm() {
    const isResetting = ref(false);
    const defaults = makeOperacionDefaults();

    const { mostrarExito, mostrarError, mostrarInfo, mostrarAdvertencia } = useMensajeGlobal();

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

            mostrarExito('Operación exitosa', 'success');
            resetForm();

            nextTick(() => {
                isResetting.value = false;
            });
        } catch (error) {
            // El error ahora debería ser un 400 (Bad Request) con detalles, no un 500.
            if (error.response) {
                console.error('Error del servidor:', error.response.data);
                // Aquí puedes mostrar los errores de validación al usuario
                mostrarError('Error al registrar: ' + JSON.stringify(error.response.data), 'error');
            } else {
                console.error('Error de red o desconocido:', error);
                mostrarError('Ocurrió un error inesperado.', 'error');
            }
        }
    };

    // Primero inicializa useFormActions
    const {
        formData: formDataRefAcciones,
        loading,
        mensaje,
        tipoMensaje,
        resetForm: originalResetForm,
        submitForm
    } = useFormActions({ defaults, onSubmitService, extraComputed: {} });

    const resetForm = async() => {
        await originalResetForm();
        mostrarInfo('Formulario limpado correctamente', 'info')
    }

    // Ahora puedes pasar formDataRefAcciones.value a los sub-composables
    const {
        addCombustibleRow,
        removeCombustibleRow,
        costoTotalCombustible,
    } = useCombustible(formDataRefAcciones);

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
    } = useMantenimiento(formDataRefAcciones);

    const {
        addServicioRow,
        removeServicioRow,
        costoTotalServicio,
    } = useServicio(formDataRefAcciones);

    watch(
        () => formDataRefAcciones.value?.tipo_operacion ?? [],
        (nuevoTipo, viejoTipo) => {
        console.log('Watch ejecutado:', { nuevoTipo, viejoTipo, isResetting: isResetting.value });

        if (isResetting.value) {
            console.log('Watch bloqueado por isResetting');
            return;
        }
        const fd = formDataRefAcciones.value;        

        // Solo ejecutar si hay un cambio real y valores válidos
        if (!viejoTipo || !nuevoTipo || viejoTipo === nuevoTipo) {
            console.log('Watch bloqueado por valores inválidos');
            return;
        }
        
        console.log('Ejecutando lógica del watch');

        // Si cambiamos fuera de combustible y había datos, los borramos
        if (nuevoTipo !== 'combustible' && fd.combustibles.length) {
            fd.combustibles = [];
            mostrarInfo('Se han descartado los datos de Combustible.', 'info');
        }
        // Si cambiamos fuera de mantenimiento y había datos, los borramos
        if (nuevoTipo !== 'mantenimiento' && fd.mantenimientos.length) {
            fd.mantenimientos = [];
            mostrarInfo('Se han descartado los datos de Mantenimiento.', 'info');
        }
        // Si cambiamos fuera de servicio y había datos, los borramos
        if (nuevoTipo !== 'servicio' && fd.servicios.length) {
            fd.servicios = [];
            mostrarInfo('Se han descartado los datos de Servicio.', 'info');
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