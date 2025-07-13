import { ref, Ref } from 'vue';
import api from '@/services/api';

import { useFormActions }   from '@/composables/global/useFormActions';
import { useNotification } from 'naive-ui';
import {
  makeVehiculoDefaults,
  type Vehiculo,
} from '@/types/vehiculo';

export function useVehiculos() {
  /* ---- defaults y estados de lista ---- */
  const defaults: Vehiculo = makeVehiculoDefaults();
  const notification = useNotification();

  const vehiculos: Ref<Vehiculo[]> = ref([]);
  const loading   = ref(false);
  const error     = ref<unknown>(null);

  /* -------- fetch lista desde backend -------- */
  const fetchVehiculos = async () => {
    loading.value = true;
    error.value   = null;
    try {
      const { data } = await api.get<Vehiculo[]>('vehiculos/');
      vehiculos.value = data;
    } catch (err) {
      console.error('[useVehiculos] fetch error:', err);
      error.value = err;
      notification.error({title: 'Error', description: 'No se pudieron cargar los vehículos'});
    } finally {
      loading.value = false;
    }
  };

  /* ------------- crear vehículo --------------- */
  const onSubmitService = async (payload: Partial<Vehiculo>) => {
    const { data } = await api.post<Vehiculo>('vehiculos/', payload);
    notification.success({title: 'Éxito', description: 'Vehículo creado correctamente'});
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
    notification.info({title: 'Formulario', description: 'Formulario limpiado correctamente'});
  };

  /* ------------- API pública ------------------- */
  return {
    // lista
    vehiculos,
    loading,
    error,
    fetchVehiculos,

    // crear
    formData,
    formLoading,
    resetForm,
    submitForm,
  };
}