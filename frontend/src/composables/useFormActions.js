import { ref } from 'vue';
import { useNotificacion } from './useNotificacion.js';

export function useFormActions({formDataRef, defaults, onSubmitService, extraComputed = {}}) {
    const loading = ref(false);
    const { mostrarNotificacion, mensaje, tipoMensaje } = useNotificacion();

    const resetForm = () => {
        Object.keys(formData.value).forEach(key => {
            if (key in defaults) {
                formData.value[key] = defaults[key];
            }
        });
    };

    const submitForm = async () => {
        loading.value = true;
        try {
            await onSubmitService(formData.value);
            mostrarNotificacion('Operación exitosa', 'success');
            resetForm();
        } catch (error) {
            mostrarNotificacion('Error al guardar los datos', 'error');
        } finally {
            loading.value = false;
        }
    };

    return {
        loading,
        resetForm,
        submitForm,
        ...extraComputed
    };
}