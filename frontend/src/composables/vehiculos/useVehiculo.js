import { ref } from 'vue';
import api from '../../services/api';
import { useFormActions } from '../../composables/global/useFormActions';
import useMensajeGlobal from '../../composables/global/useMensajeGlobal';
import { makeVehiculoDefaults } from '../../types/vehiculo';

export function useVehiculos() {
  const defaults = makeVehiculoDefaults();

  const { mostrarExito, mostrarError, mostrarInfo } = useMensajeGlobal();

  // Estados para la lista de vehículos
  const vehiculos = ref([]);
  const loading = ref(false);
  const error = ref(null);

  // Función para obtener la lista de vehículos
  const fetchVehiculos = async () => {
    loading.value = true;
    error.value = null;
    try {
      const response = await api.get('vehiculos/');
      vehiculos.value = response.data;
    } catch (err) {
      console.error('Error al obtener vehículos:', err);
      error.value = err;
      mostrarError('Error al cargar la lista de vehículos', 'error');
    } finally {
      loading.value = false;
    }
  };

  // Función para crear vehículos (mantiene la funcionalidad original)
  const onSubmitService = async (payload) => {
    try {
      const response = await api.post('vehiculos/', payload);
      mostrarExito('Vehículo registrado exitosamente', 'success');
      return response.data;
    } catch (err) {
      console.error('Error al guardar vehículo:', err);
      
      if (err.response?.data) {
        const errorData = err.response.data;
        let mensajeError = 'Error al registrar vehículo:\n';
        
        Object.keys(errorData).forEach(field => {
          if (Array.isArray(errorData[field])) {
            mensajeError += `${field}: ${errorData[field].join(', ')}\n`;
          }
        });
        
        mostrarError(mensajeError, 'error');
      } else {
        mostrarError('Error de conexión. Intente nuevamente.', 'error');
      }
      
      throw err;
    }
  };

  const {
    formData,
    loading: formLoading,
    resetForm: originalResetForm,
    submitForm,
  } = useFormActions({defaults, onSubmitService, extraComputed: {} });

  const resetForm = async() => {
    await originalResetForm();
    mostrarInfo('Formulario limpiado correctamente', 'info');
  };

  return {
    // Para la lista de vehículos
    vehiculos,
    loading,
    error,
    fetchVehiculos,
    
    // Para crear vehículos
    formData,
    formLoading,
    resetForm,
    submitForm,
  };
}