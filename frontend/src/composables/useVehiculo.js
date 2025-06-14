import { ref } from 'vue';
import api from '../services/api.js';
import { useFormActions } from './useFormActions';
import useMensajeGlobal from './useMensajeGlobal';

export function useVehiculos() {
  const defaults = {
    placa: '',
    anio: 2024,
    kilometraje: 0,
    costo: 0,
    ubicacion: '',
    categoria: '',
    marca: '',
    modelo: '',
    version: '',
    color: '',
    anio_fabricacion: 2024,
    anio_modelo: 2024,
    motor: '',
    combustible: '',
    forma_rodante: '',
    vin: '',
    serie_chasis: '',
    ejes: 0,
    ruedas: 0,
    pasajeros: 0,
    carroceria: '',
    peso_neto: 0,
    peso_bruto: 0,
    carga_util: 0,
    cilindrada: 0,
    cilindros: 0,
    altura: 0,
    ancho: 0,
    longitud: 0,
  };

  const { mostrarExito, mostrarError, mostrarInfo, mostrarAdvertencia } = useMensajeGlobal();

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