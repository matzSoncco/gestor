// src/composables/useVehiculos.ts
import { ref, nextTick, type Ref } from 'vue'
import { useNotify }   from '@/composables/global/useNotify'
import { useFormActions } from '@/composables/global/useFormActions'
import { validateRequired } from '@/utils/validateRequired'
import { makeVehiculoDefaults, type Vehiculo } from '@/types/vehiculo'

/* ⬇️ importa las funciones HTTP recién creadas */
import {
  fetchVehiculos,
  createVehiculo,
  updateVehiculo,
  deleteVehiculo
} from '@/api/vehiculo'

function validateVehiculo (p: Partial<Vehiculo>): string | null {
  const required: (keyof Vehiculo)[] = ['placa', 'marca', 'modelo']
  return validateRequired(p, required)
}

export function useVehiculos () {
  /* -------- estado -------- */
  const vehiculos: Ref<Vehiculo[]> = ref([])
  const loading  = ref(false)
  const { success, error, info } = useNotify()

  /* -------- cargar lista -------- */
  const load = async () => {
    loading.value = true
    try {
      const { data } = await fetchVehiculos()
      vehiculos.value = data
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
    if (msg) { error(msg); throw new Error(msg) }

    const { data } = await createVehiculo(payload)
    success('Vehículo creado')
    vehiculos.value.unshift(data)     // opcional (optimista)
    return data
  }

  /* -------- editar -------- */
  const update = async (id: number, payload: Partial<Vehiculo>) => {
    const { data } = await updateVehiculo(id, payload)
    const idx = vehiculos.value.findIndex(v => v.id === id)
    if (idx !== -1) vehiculos.value[idx] = data
    success('Vehículo actualizado')
    return data
  }

  /* -------- eliminar -------- */
  const remove = async (id: number) => {
    await deleteVehiculo(id)
    vehiculos.value = vehiculos.value.filter(v => v.id !== id)
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
    load,          // listar
    create: submitForm,
    update,
    remove,
    // helpers de formulario
    formData,
    formLoading,
    resetForm
  }
}