import { ref, reactive, watch } from 'vue';
import apiService from '../services/apiService';

const useFormLogic = () => {
  const formData = reactive({
    numeroDocumento: '',
    rucProveedor: '',
    tipoOperacion: '',
    fecha: '',
    nombreProveedor: '',
    descripcion: ''
  });

  const loading = ref(false);

  const resetForm = () => {
    Object.keys(formData).forEach(key => {
      formData[key] = '';
    });
  };

  const enviarFormulario = async () => {
    loading.value = true;
    try {
      const response = await apiService.submitFormData(formData);
      console.log('Formulario enviado:', response.data);
      resetForm();
    } catch (error) {
      console.error('Error al enviar formulario:', error);
    } finally {
      loading.value = false;
    }
  };

  return { formData, loading, enviarFormulario, resetForm };
};

export default useFormLogic;