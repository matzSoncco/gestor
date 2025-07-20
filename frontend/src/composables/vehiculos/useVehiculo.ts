import { ref, computed, nextTick } from 'vue'
import { useVehiculoStore } from '@/stores/vehiculoStore'
import { useNotify } from '@/composables/global/useNotify'
import { useFormActions } from '@/composables/global/useFormActions'
import { validateRequired } from '@/utils/validateRequired'
import { makeVehiculoDefaults, type Vehiculo } from '@/types/vehiculo'
import { usePagination } from '../global/usePagination'

import {
  fetchVehiculos,
  createVehiculo,
  updateVehiculo,
  deleteVehiculo
} from '@/api/vehiculos'

function validateVehiculo(p: Partial<Vehiculo>): string | null {
  const required: (keyof Vehiculo)[] = ['placa', 'marca', 'modelo']
  return validateRequired(p, required)
}

export function useVehiculos() {
  const vehiculoStore = useVehiculoStore()
  const { success, error, info } = useNotify()

  // ✅ Mantener usePagination genérico - NO renombrar items
  const {
    items,
    total,
    currentPage,
    pageSize,
    loading,
    load: loadVehiculos, // ✅ Este es el que necesitas para la tabla
    setPage
  } = usePagination<Vehiculo>({
    fetcher: fetchVehiculos,
    pageSize: 10
  })

  // ✅ Computed que une ambas fuentes cuando sea necesario
  const vehiculos = computed(() => items.value || [])

  // ✅ Método para sincronizar el store con los datos paginados
  const syncStore = () => {
    vehiculoStore.setVehiculos(items.value)
  }

  // ✅ Método para actualizar un vehículo específico en ambas fuentes
  const updateVehiculoLocal = (updated: Vehiculo) => {
    // Actualizar store
    vehiculoStore.actualizarVehiculo(updated)
    
    // Actualizar items paginados
    const idx = items.value.findIndex(v => v.id === updated.id)
    if (idx !== -1) {
      items.value[idx] = { ...items.value[idx], ...updated }
    }
  }

  /* -------- crear -------- */
  const onSubmitService = async (payload: Partial<Vehiculo>) => {
    const msg = validateVehiculo(payload)
    if (msg) {
      error(msg)
      throw new Error(msg)
    }

    const { data } = await createVehiculo(payload)
    
    // Actualizar items locales y store
    items.value = [data, ...items.value]
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
    items.value = items.value.filter(v => v.id !== id)
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
    defaults: makeVehiculoDefaults(),
    onSubmitService,
    onResetCallback: () => info('Formulario reiniciado'),
  })

  const resetForm = async () => {
    await baseReset()
    await nextTick()
  }

  /* -------- API pública del composable -------- */
  return {
    vehiculos: items, // ✅ Computed que devuelve items.value
    loading,
    total,
    currentPage,
    pageSize,
    setPage,
    load, // ✅ Load personalizado que sincroniza
    create: submitForm,
    update,
    remove,
    formData,
    formLoading,
    resetForm,
    updateVehiculoLocal // ✅ Exportar para usar en el componente
  }
}