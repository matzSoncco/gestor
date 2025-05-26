import { reactive, ref, watch } from 'vue';
import api from '../services/api.js';

import { useCombustible } from './useCombustible.js';
import { useMantenimiento } from './useMantenimiento.js';
import { useServicio } from './useServicio.js';
import { useFormActions } from './useFormActions.js';

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

    const onSubmitService = async (payload) => {
        const { data } = await api.post('/', payload);
        try {
            if (data.tipoOperacion === 'combustible') {
                await Promise.all(
                    payload.combustibles.map(item => {
                        return api.post('combustibles/', {
                            ...data,
                            cantidadGalones: item.cantidadGalones,
                            costoPorGalon: item.costoPorGalon,
                            subtotal: item.cantidadGalones * item.costoPorGalon,
                            placaVehiculo: item.placaVehiculo,
                        });
                    })
                );
            } else if (data.tipoOperacion === 'mantenimiento') {
                await Promise.all(
                    payload.mantenimientos.map(item => {
                        return api.post('mantenimientos/', {
                            ...data,
                            descripcionItem: item.descripcionItem,
                            cantidad: item.cantidad,
                            costoUnitario: item.costoUnitario,
                            subtotal: item.cantidad * item.costoUnitario,
                        });
                    })
                );
            } else if (data.tipoOperacion === 'servicio') {
                await Promise.all(
                    payload.servicios.map(item => {
                        return api.post('servicios/', {
                            ...data,
                            descripcionServicio: item.descripcionServicio,
                            costoServicio: item.costoServicio,
                        });
                    })
                );
            } else {
                throw new Error('Tipo de operación no soportado');
            }

            mostrarNotificacion('Operación exitosa', 'success');
            resetForm();

        } catch (error) {
            console.error(error);
            mostrarNotificacion('Error al guardar los datos', 'error');
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