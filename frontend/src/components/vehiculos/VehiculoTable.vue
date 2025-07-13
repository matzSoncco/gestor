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
        <n-data-table
          :columns="columns"
          :data="vehiculosFiltrados"
          :loading="loading"
          :bordered="false"
          :pagination="false"
          row-class-name="getRowClass"
        >
          <template #empty>
            <div class="text-center text-gray-500">No se encontraron vehículos</div>
          </template>
        </n-data-table>

        <div v-if="error" class="mt-4 text-red-600">
          Error al cargar los vehículos: {{ error.message || error }}
        </div>

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

<script setup>
import { ref, computed, onMounted, h } from 'vue'
import { NButton } from 'naive-ui'
import { useVehiculos } from '@/composables/vehiculos/useVehiculo'
import ActualizarKmModal from '@/components/modals/ActualizarKmModal.vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const { vehiculos, error, loading, fetchVehiculos } = useVehiculos()

const threshold = ref(300)
const modalVisible = ref(false)
const selectedId = ref(null)
const searchPlaca = ref('')

onMounted(fetchVehiculos)

const vehiculosFiltrados = computed(() =>
  vehiculos.value.filter(v =>
    v.placa.toLowerCase().includes(searchPlaca.value.toLowerCase())
  )
)

function openModal(id) {
  selectedId.value = id
  modalVisible.value = true
}

function closeModal() {
  modalVisible.value = false
  selectedId.value = null
}

function onKmActualizado(updatedVehiculo) {
  const idx = vehiculos.value.findIndex(v => v.id === updatedVehiculo.id)
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
    render(row) {
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
function getRowClass(row) {
  return row.kilometraje >= threshold.value ? 'bg-red-100' : ''
}
</script>