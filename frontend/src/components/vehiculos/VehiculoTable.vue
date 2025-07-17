<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 md:p-6">
    <div class="max-w-6x1 mx-auto space-y-6">
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div class="flex items-center justify-between mb-4">
          <div>
            <h1 class="text-2xl font-bold text-gray-800">Listado de Vehículos</h1>
            <p class="text-gray-500">Consulta y gestiona vehículos registrados</p>
          </div>
        </div>

        <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-3 md:gap-4">
          <n-button
            type="primary"
            @click="$router.push({ name: 'RegistroVehiculos' })"
            class="w-full md:w-auto"
          >
            Registrar Vehículo
          </n-button>
          
          <n-input
            v-model:value="searchPlaca"
            placeholder="Buscar por placa"
            clearable
            class="w-full md:w-64"
          />
        </div>
      </div>

      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <template v-if="!loadError">
          <n-data-table
            :columns="columns"
            :data="vehiculosFiltrados"
            :loading="loading"
            :bordered="false"
            :pagination="false"
            :row-class-name="getRowClassName"
          >
            <template #empty>
              <div class="text-center text-gray-500">
                No se encontraron Vehículos Registrados.
              </div>
            </template>
          </n-data-table>

          <ActualizarKmModal
            v-if="modalVisible"
            :visible="modalVisible"
            :vehicle-id="selectedId"
            @close="closeModal"
            @saved="onKmActualizado"
          />
        </template>

        <!-- Mostrar sólo si hubo error al cargar -->
        <n-result
          v-else
          status="error"
          class="mt-6"
          title="Error al cargar los vehículos"
          description="No se pudo conectar con el servidor. Verifica tu conexión o intenta nuevamente."
        >
          <template #footer>
            <n-button @click="reintentarCarga" type="primary">Reintentar</n-button>
          </template>
        </n-result>
        <ActualizarKmModal
          v-if="modalVisible"
          :visible="modalVisible"
          :vehicle-id="selectedId"
          @close="closeModal"
          @saved="onKmActualizado"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, h } from 'vue'
import { NButton } from 'naive-ui'
import { useVehiculos } from '@/composables/vehiculos/useVehiculo'

import ActualizarKmModal from '@/components/modals/ActualizarKmModal.vue'
import { useRouter } from 'vue-router'
import { Vehiculo } from '@/types/vehiculo'

const router = useRouter()
const { vehiculos, loading, load } = useVehiculos()

const threshold = ref<number>(300)
const modalVisible = ref<boolean>(false)
const selectedId = ref<number | null>(null)
const searchPlaca = ref<string>('')
const loadError = ref<boolean>(false)

onMounted(async () => {
  try {
    await load()
    loadError.value = false
  } catch {
    loadError.value = true
  }
})

const reintentarCarga = async () => {
  loadError.value = false
  try {
    await load()
  } catch {
    loadError.value = true
  }
}

const vehiculosFiltrados = computed(() =>
  vehiculos.value.filter(v =>
    v.placa.toLowerCase().includes(searchPlaca.value.toLowerCase())
  )
)

function openModal(id: number) {
  selectedId.value = id
  modalVisible.value = true
}

function closeModal() {
  modalVisible.value = false
  selectedId.value = null
}

const onKmActualizado = (payload: Vehiculo) => {
  const updatedVehiculo = payload as Vehiculo
  const idx = vehiculos.value.findIndex((v) => v.id === updatedVehiculo.id)
  if (idx !== -1) {
    vehiculos.value[idx].kilometraje = updatedVehiculo.kilometraje
  }
  closeModal()
}

// Columnas para la tabla de Naive UI
const columns = [
  {
    title: 'Placa',
    key: 'placa',
  },
  {
    title: 'Marca',
    key: 'marca',
  },
  {
    title: 'Kilometraje',
    key: 'kilometraje',
  },
  {
    title: 'VIN',
    key: 'vin',
  },
  {
    title: 'Acciones',
    key: 'acciones',
    render(row: Vehiculo) {
      return h('div', { class: 'flex gap-2' }, [
        h(
          NButton,
          {
            size: 'small',
            tertiary: true,
            onClick: () =>
              router.push({ name: 'VehiculoDetails', params: { id: row.id } }),
          },
          { default: () => 'Ver' }
        ),
        h(
          NButton,
          {
            size: 'small',
            tertiary: true,
            type: 'info',
            onClick: () => openModal(row.id),
          },
          { default: () => 'Actualizar KM' }
        ),
      ])
    },
  },
]

// Resaltar filas según kilometraje
// Reemplaza la función getRowClass con row-props
const getRowClassName = (row: Vehiculo) => {
  const km = Number(row.kilometraje)
  return !isNaN(km) && km >= threshold.value ? 'row-km-alto' : ''
}
</script>

<style scoped>
:deep(.row-km-alto td) {
  background-color: #fee2e2 !important;
  color: #991b1b !important;
  font-weight: 600;
}
</style>