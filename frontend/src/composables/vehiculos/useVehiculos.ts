import { ref, computed, nextTick } from 'vue'
import { useVehiculoStore } from '@/stores/vehiculoStore'
import { useNotify } from '@/composables/global/useNotify'
import { useFormActions } from '@/composables/global/useFormActions'
import { validateRequired } from '@/utils/validateRequired'
import { usePagination } from '../global/usePagination'

import {
  fetchVehiculos,
  createVehiculo,
  updateVehiculo,
  deleteVehiculo
} from '@/api/vehiculos'

import {
  makeVehiculoDefaults,
  type Vehiculo
} from '@/types/vehiculo'

function validateVehiculo(p: Partial<Vehiculo>): string | null {
  const required: (keyof Vehiculo)[] = [
    'placa',
    'marca',
    'modelo'
  ];

  return validateRequired(p, required)
}

export function useVehiculos() {
  const vehiculoStore = useVehiculoStore();
  const isResetting = ref(false);
  const defaults = makeVehiculoDefaults();
  const { success, error, info } = useNotify();

  const filtros = ref({
    placa: ''
  })

  const {
    items: vehiculos,
    total,
    currentPage,
    pageSize,
    loading,
    load: loadVehiculos,
    setPage,
    params
  } = usePagination<Vehiculo>({
    fetcher: fetchVehiculos,
    pageSize: 6
  })

  // ✅ Computed que une ambas fuentes cuando sea necesario
  //const vehiculos = computed(() => items.value || [])

  const aplicarFiltros = () => {
    const hayFiltros = filtros.value.placa.trim() !== ''

    if (!hayFiltros) {
      setPage(1);
    }

    const filtrosParams: Record<string, any> = {};

    if (filtros.value.placa.trim()) {
      filtrosParams.placa = filtros.value.placa.trim();
    }

    params.value = filtrosParams;
    loadVehiculos()
  }
  // ✅ Método para sincronizar el store con los datos paginados
  const syncStore = () => {
    vehiculoStore.setVehiculos(vehiculos.value)
  }

  // ✅ Método para actualizar un vehículo específico en ambas fuentes
  const updateVehiculoLocal = (updated: Vehiculo) => {
    // Actualizar store
    vehiculoStore.actualizarVehiculo(updated)
    
    // Actualizar items paginados
    const idx = vehiculos.value.findIndex(v => v.id === updated.id)
    if (idx !== -1) {
      vehiculos.value[idx] = { ...vehiculos.value[idx], ...updated }
    }
  }

  /* -------- crear -------- */
  const create = async (payload: Partial<Vehiculo>) => {
    const msg = validateVehiculo(payload)
    if (msg) {
      error(msg)
      throw new Error(msg)
    }

    const { data } = await createVehiculo(payload)
    
    // Actualizar items locales y store
    vehiculos.value = [data, ...vehiculos.value]
    vehiculoStore.setVehiculos([data, ...vehiculoStore.vehiculos])
    
    success('Vehículo creado')
    return data
  }

  /* -------- editar -------- */
  const update = async (id: number, payload: Partial<Vehiculo>) => {
    const { data } = await updateVehiculo(id, payload)
    updateVehiculoLocal(data)
    success('Vehículo actualizado')
    return data
  }

  /* -------- eliminar -------- */
  const remove = async (id: number) => {
    await deleteVehiculo(id)
    
    // Remover de ambas fuentes
    vehiculos.value = vehiculos.value.filter(v => v.id !== id)
    vehiculoStore.setVehiculos(vehiculoStore.vehiculos.filter(v => v.id !== id))
    
    success('Vehículo eliminado')
  }

  /* -------- load con sincronización -------- */
  const load = async () => {
    await loadVehiculos()
    syncStore() // Sincronizar store después de cargar
  }

  /* -------- formulario reusable -------- */
  const {
    formData,
    loading: formLoading,
    resetForm: baseReset,
    submitForm
  } = useFormActions<Vehiculo>({
    defaults,
    onSubmitService: create,
    onResetCallback: () => info('Formulario limpiado'),
  })

  const resetForm = async () => {
    isResetting.value = true;
    await baseReset();
    await nextTick();
    isResetting.value = false;
  }

  /* -------- API pública del composable -------- */
  return {
    vehiculos,
    loading,
    total,
    currentPage,
    pageSize,
    load: loadVehiculos,
    setPage,
    filtros,
    aplicarFiltros,

    formData,
    formLoading,
    resetForm,
    submitForm,

    create: submitForm,
    update,
    remove,
    
    updateVehiculoLocal // ✅ Exportar para usar en el componente
  }
}