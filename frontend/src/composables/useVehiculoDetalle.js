import { ref } from 'vue';
import api from '../services/api.js';
import useMensajeGlobal from './useMensajeGlobal';

export function useVehiculoDetalle() {
  const { mostrarExito, mostrarError } = useMensajeGlobal();

  const vehiculo = ref(null);
  const loading = ref(false);
  const error = ref(null);

  const fetchVehiculo = async (id) => {
    loading.value = true;
    error.value = null;
    try {
      const response = await api.get(`vehiculos/${id}/`);
      vehiculo.value = response.data;
      return response.data;
    } catch (err) {
      console.error('Error al obtener vehículo:', err);
      error.value = err;
      mostrarError('Error al cargar el vehículo', 'error');
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const updateKilometraje = async (id, nuevoKilometraje) => {
    try {
      const response = await api.patch(`vehiculos/${id}/`, {
        kilometraje: nuevoKilometraje
      });
      
      // Actualizar el vehículo local
      if (vehiculo.value) {
        vehiculo.value.kilometraje = nuevoKilometraje;
      }
      
      mostrarExito('Kilometraje actualizado exitosamente', 'success');
      return response.data;
    } catch (err) {
      console.error('Error al actualizar kilometraje:', err);
      
      if (err.response?.data) {
        const errorData = err.response.data;
        let mensajeError = 'Error al actualizar kilometraje:\n';
        
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

  const resetVehiculo = () => {
    vehiculo.value = null;
    error.value = null;
    loading.value = false;
  };

  return {
    vehiculo,
    loading,
    error,
    fetchVehiculo,
    updateKilometraje,
    resetVehiculo,
  };
}