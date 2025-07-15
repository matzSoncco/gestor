// composables/vehiculos/useVehiculos.ts
import { ref, Ref, nextTick } from 'vue';
import api from '@/services/api';

import { useFormActions }   from '@/composables/global/useFormActions';
import { useNotify }        from '@/composables/global/useNotify';
import { validateRequired } from '@/utils/validateRequired';

import {
  makeVehiculoDefaults,
  type Vehiculo,
} from '@/types/vehiculo';

/* ----------------- VALIDACIÓN ----------------- */
function validateVehiculo(p: Partial<Vehiculo>): string | null {
  // Campos que aparecerán marcados con * en el formulario
  const required: (keyof Vehiculo)[] = ['placa', 'marca', 'modelo'];
  return validateRequired(p, required); // mensaje global genérico
}

export function useVehiculos() {
  /* ---- defaults y estados de lista ---- */
  const isResetting = ref(false);
  const defaults: Vehiculo = makeVehiculoDefaults();
  const { success, error, info } = useNotify();

  const vehiculos: Ref<Vehiculo[]> = ref([]);
  const loading = ref(false);

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
    /* Validación global antes de enviar */
    const msg = validateVehiculo(payload);
    if (msg) {
      error(msg);
      throw new Error(msg); // evita que useFormActions haga reset
    }

    const { data } = await api.post<Vehiculo>('vehiculos/', payload);
    success('Vehículo creado correctamente');
    // Podrías refrescar la lista automáticamente:
    // await fetchVehiculos();
    return data;
  };

  /* ------------ acciones genéricas ------------- */
  const {
    formData,
    loading: formLoading,
    resetForm: baseReset,
    submitForm,
  } = useFormActions<Vehiculo>({
    defaults,
    onSubmitService,
    onResetCallback: () => info('Formulario reiniciado'),
    onSubmitCallback: () => { void fetchVehiculos(); } // recarga lista tras crear
  });

  const resetForm = async () => {
    isResetting.value = true;
    await baseReset();
    await nextTick();
    isResetting.value = false;
  };

  /* ------------- API pública ------------------- */
  return {
    // lista
    vehiculos,
    loading,
    fetchVehiculos,

    // creación
    formData,
    formLoading,
    resetForm,
    submitForm,
  };
}