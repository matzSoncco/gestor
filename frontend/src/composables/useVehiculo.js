import { ref } from 'vue';
import api from '../services/api.js';

export function useVehiculos() {
  const vehiculos = ref([]);
  const loading   = ref(false);
  const error     = ref(null);

  const fetchVehiculos = async () => {
    loading.value = true;
    try {
      const { data } = await api.get('vehiculos/');
      vehiculos.value = data;
    } catch (e) {
      error.value = e;
    } finally {
      loading.value = false;
    }
  };

  const createVehiculo = async payload => {
    await api.post('vehiculos/', payload);
    await fetchVehiculos();
  };

  const updateVehiculo = async (id, payload) => {
    await api.put(`vehiculos/${id}/`, payload);
    await fetchVehiculos();
  };

  const deleteVehiculo = async id => {
    await api.delete(`vehiculos/${id}/`);
    await fetchVehiculos();
  };

  return {
    vehiculos,
    loading,
    error,
    fetchVehiculos,
    createVehiculo,
    updateVehiculo,
    deleteVehiculo,
  };
}