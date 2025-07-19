import { ref, Ref } from 'vue';
import api from '@/services/authService';
import { useNotify } from '../global/useNotify';
import type { Vehiculo } from '@/types/vehiculo';

export function useVehiculoDetalle() {
  const notification = useNotify();

  const vehiculo: Ref<Vehiculo | null> = ref(null);
  const loading = ref(false);
  const error   = ref<unknown>(null);

  /* Obtener vehículo por id */
  const fetchVehiculo = async (id: number | string): Promise<Vehiculo> => {
    loading.value = true;
    error.value   = null;
    try {
      const { data } = await api.get<Vehiculo>(`vehiculos/${id}/`);
      vehiculo.value = data;
      return data;
    } catch (err) {
      console.error('[useVehiculoDetalle] fetch error:', err);
      error.value = err;
      notification.error('Error', 'No se pudo cargar el vehículo');
      throw err;
    } finally {
      loading.value = false;
    }
  };

  /* PATCH de kilometraje */
  const updateKilometraje = async (
    id: number | string,
    nuevoKilometraje: number,
  ): Promise<Vehiculo> => {
    try {
      const { data } = await api.patch<Vehiculo>(`vehiculos/${id}/`, {
        kilometraje: nuevoKilometraje,
      });

      if (vehiculo.value) vehiculo.value.kilometraje = nuevoKilometraje;

      notification.success('Kilometraje actualizado correctamente.', 'Éxito');
      return data;
    } catch (err: any) {
      console.error('[useVehiculoDetalle] patch error:', err);
      const msg = err?.response?.data
        ? JSON.stringify(err.response.data)
        : 'Error de conexión';
      notification.error('Error', msg);
      throw err;
    }
  };

  const resetVehiculo = (): void => {
    vehiculo.value = null;
    error.value    = null;
    loading.value  = false;
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