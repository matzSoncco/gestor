import { ref, Ref } from 'vue';
import api from '@/services/api';

import { useFormActions }   from '@/composables/global/useFormActions';
import { useNotify } from '@/composables/global/useNotify';
import {
  makeVehiculoDefaults,
  type Vehiculo,
} from '@/types/vehiculo';

export function useVehiculos() {
  /* ---- defaults y estados de lista ---- */
  const defaults: Vehiculo = makeVehiculoDefaults();
  const { success, error, info} = useNotify();

  const vehiculos: Ref<Vehiculo[]> = ref([]);
  const loading   = ref(false);

  /* -------- fetch lista desde backend -------- */
  const fetchVehiculos = async () => {
    loading.value = true;
    try {
      const { data } = await api.get<Vehiculo[]>('vehiculos/');
      vehiculos.value = data;
      return true;
    } catch (err) {
      error('Error al cargar vehículos');
      throw err;
    } finally {
      loading.value = false;
    }
  };

  /* ------------- crear vehículo --------------- */
  const onSubmitService = async (payload: Partial<Vehiculo>) => {
    const { data } = await api.post<Vehiculo>('vehiculos/', payload);
    success('Vehículo creado correctamente');
    return data; // se usa en onSubmitCallback si lo deseas
  };

  const {
    formData,
    loading: formLoading,
    resetForm: baseReset,
    submitForm,
  } = useFormActions<Vehiculo>({
    defaults,
    onSubmitService,
  });

  const resetForm = async () => {
    await baseReset();
    info('Formulario reiniciado');
  };

  /* ------------- API pública ------------------- */
  return {
    // lista
    vehiculos,
    loading,
    fetchVehiculos,

    // crear
    formData,
    formLoading,
    resetForm,
    submitForm,
  };
}