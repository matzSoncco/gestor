import { ref, computed, nextTick } from 'vue'
import { useVehiculoStore } from '@/stores/vehiculoStore'
import { useNotify } from '@/composables/global/useNotify'
import { useFormActions } from '@/composables/global/useFormActions'
import { validateRequired } from '@/utils/validateRequired'
import { makeVehiculoDefaults, type Vehiculo } from '@/types/vehiculo'

import {
  fetchVehiculos,
  createVehiculo,
  updateVehiculo,
  deleteVehiculo
} from '@/api/vehiculo'

function validateVehiculo(p: Partial<Vehiculo>): string | null {
  const required: (keyof Vehiculo)[] = ['placa', 'marca', 'modelo']
  return validateRequired(p, required)
}

export function useVehiculos() {
  const vehiculoStore = useVehiculoStore()
  const { success, error, info } = useNotify()
  const loading = ref(false)

  const vehiculos = computed(() => vehiculoStore.vehiculos)

  /* -------- cargar lista -------- */
  const load = async () => {
    try {
      loading.value = true
      const { data } = await fetchVehiculos()
      vehiculoStore.setVehiculos(data)
    } catch (e) {
      error('Error al cargar vehículos')
      throw e
    } finally {
      loading.value = false
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
    vehiculoStore.setVehiculos([data, ...vehiculos.value]) // inserta al inicio
    success('Vehículo creado')
    return data
  }

  /* -------- editar -------- */
  const update = async (id: number, payload: Partial<Vehiculo>) => {
    const { data } = await updateVehiculo(id, payload)
    vehiculoStore.actualizarVehiculo(data)
    success('Vehículo actualizado')
    return data
  }

  /* -------- eliminar -------- */
  const remove = async (id: number) => {
    await deleteVehiculo(id)
    vehiculoStore.setVehiculos(vehiculos.value.filter(v => v.id !== id))
    success('Vehículo eliminado')
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
    vehiculos,
    loading,
    load,
    create: submitForm,
    update,
    remove,
    formData,
    formLoading,
    resetForm
  }
}
