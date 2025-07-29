import { ref, nextTick } from 'vue'
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

  const syncStoreWithPagination  = () => { //cambio de nombre a una más descriptiva
    vehiculoStore.setVehiculos(vehiculos.value)
  }

  const updateVehiculoInBothSources  = (updated: Vehiculo) => { //nombre mas descriptivo, explica qué hace
    //ctualizar store global
    vehiculoStore.actualizarVehiculo(updated)
    
    //actualizar items paginados (si está en la pag actual)
    const idx = vehiculos.value.findIndex(v => v.id === updated.id)
    if (idx !== -1) {
      vehiculos.value[idx] = { ...vehiculos.value[idx], ...updated }
    }
  }

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

  const loadData = async () => { //evitamos confucion con loadVehiculos
    await loadVehiculos()
    syncStoreWithPagination() //sincronizar después de cargar
  }

  /* -------- crear -------- */
  const createVehiculoAction  = async (payload: Partial<Vehiculo>) => {
    const msg = validateVehiculo(payload)
    if (msg) {
      error(msg)
      throw new Error(msg)
    }
    try {
      const data = await createVehiculo(payload)
      
      vehiculos.value = [data, ...vehiculos.value]
      vehiculoStore.setVehiculos([data, ...vehiculoStore.vehiculos])
      
      success('Vehículo creado exitosamente')
      return data
    } catch (err) {
      error('Error al crear el vehículo')
      throw err
    }
  }

  /* -------- editar -------- */
  const updateVehiculoAction  = async (id: number, payload: Partial<Vehiculo>) => {
    try {
      const data = await updateVehiculo(id, payload)
      updateVehiculoInBothSources(data)
      success('Vehículo actualizado exitosamente')
      return data
    } catch (err) {
      error('Error al actualizar el vehículo')
      throw err
    }
  }

  /* -------- eliminar -------- */
  const deleteVehiculoAction = async (id: number) => {
    try {
      await deleteVehiculo(id)
      
      // Remover de ambas fuentes
      vehiculos.value = vehiculos.value.filter(v => v.id !== id)
      vehiculoStore.setVehiculos(vehiculoStore.vehiculos.filter(v => v.id !== id))
      
      success('Vehículo eliminado exitosamente')
    } catch (err) {
      error('Error al eliminar el vehículo')
      throw err
    }
  }

  /* -------- formulario reusable -------- */
  const {
    formData,
    loading: formLoading,
    resetForm: baseReset,
    submitForm
  } = useFormActions<Vehiculo>({
    defaults,
    onSubmitService: createVehiculoAction,
    onResetCallback: () => info('Formulario limpiado'),
  })

  const resetForm = async () => {
    isResetting.value = true;
    await baseReset();
    await nextTick();
    isResetting.value = false;
  }

  const refresh = async () => {
    await loadData()
    info('Datos actualizados')
  }

  /* -------- API pública del composable -------- */
  return {
    vehiculos,
    loading,
    total,
    currentPage,
    pageSize,
    setPage,

    filtros,
    aplicarFiltros,

    formData,
    formLoading,
    resetForm,
    submitForm,

    loadData,
    createVehiculo: createVehiculoAction, // Para crear programáticamente
    updateVehiculo: updateVehiculoAction,
    deleteVehiculo: deleteVehiculoAction,
    
    refresh,

    updateVehiculoInBothSources,
    syncStoreWithPagination,
    
    isResetting
  }
}