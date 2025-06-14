import { ref, toRaw } from 'vue';

export function useFormActions({ 
  defaults, 
  onSubmitService, 
  extraComputed = {}, 
  onResetCallback = null,
  onSubmitCallback = null 
}) {
  const loading = ref(false);
  const formData = ref({ ...defaults });

  const resetForm = async () => {
    try {
      // Resetear todos los campos a sus valores por defecto
      Object.keys(defaults).forEach(key => {
        formData.value[key] = defaults[key];
      });

      // Ejecutar callback personalizado si existe
      if (onResetCallback && typeof onResetCallback === 'function') {
        await onResetCallback();
      }
    } catch (error) {
      console.error('Error al resetear formulario:', error);
    }
  };

  // Función para limpiar datos reactivos y crear un objeto plano
  const cleanReactiveData = (data) => {
    // Método más simple y directo
    const cleanData = {};
    
    Object.keys(data).forEach(key => {
      const value = data[key];
      
      if (value === null || value === undefined) {
        cleanData[key] = value;
      } else if (Array.isArray(value)) {
        // Para arrays, crear una copia limpia
        cleanData[key] = value.map(item => {
          if (typeof item === 'object' && item !== null) {
            // Crear objeto plano sin referencias reactivas
            const cleanItem = {};
            Object.keys(item).forEach(itemKey => {
              cleanItem[itemKey] = item[itemKey];
            });
            return cleanItem;
          }
          return item;
        });
      } else if (typeof value === 'object') {
        // Para objetos, crear una copia limpia
        cleanData[key] = { ...value };
      } else {
        // Para primitivos, copiar directamente
        cleanData[key] = value;
      }
    });
    
    return cleanData;
  };

  const submitForm = async () => {
    if (loading.value) return; // Prevenir múltiples envíos

    loading.value = true;
    
    try {
      // Limpiar datos reactivos antes de procesar
      const cleanFormData = cleanReactiveData(formData.value);
      
      // Validaciones básicas antes del envío
      const requiredFields = Object.keys(defaults).filter(key => 
        cleanFormData[key] === '' || cleanFormData[key] === null || cleanFormData[key] === undefined
      );

      // Crear payload limpio (sin campos vacíos innecesarios)
      const payload = {};
      Object.keys(cleanFormData).forEach(key => {
        if (cleanFormData[key] !== '' && cleanFormData[key] !== null && cleanFormData[key] !== undefined) {
          payload[key] = cleanFormData[key];
        }
      });

      // Llamar al servicio
      const result = await onSubmitService(payload);

      // Ejecutar callback post-envío si existe
      if (onSubmitCallback && typeof onSubmitCallback === 'function') {
        await onSubmitCallback(result);
      }

      // Resetear formulario después del envío exitoso
      await resetForm();

    } catch (error) {
      console.error('Error en submitForm:', error);
      // El error ya fue manejado en onSubmitService
    } finally {
      loading.value = false;
    }
  };

  return {
    formData,
    loading,
    resetForm,
    submitForm,
    ...extraComputed
  };
}