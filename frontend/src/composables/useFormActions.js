import { ref } from 'vue';
import { useNotificacion } from './useNotificacion.js';

export function useFormActions({ defaults, onSubmitService, extraComputed = {}}) {
    const formData = ref({ ...defaults });
    const loading = ref(false);
    const { mostrarNotificacion, mensaje, tipoMensaje } = useNotificacion();

    const resetForm = () => {
        formData.value = { ...defaults };
    };

    const submitForm = async () => {
        loading.value = true;
        try {
            await onSubmitService(formData.value);
        } catch (error) {
            console.error('Error en submitForm de useFormActions:', error);
            mostrarNotificacion('Error al guardar los datos', 'error');
        } finally {
            loading.value = false;
        }
    };

    return {
        formData,
        loading,
        resetForm,
        submitForm,
        mensaje,
        tipoMensaje,
        ...extraComputed
    };
}