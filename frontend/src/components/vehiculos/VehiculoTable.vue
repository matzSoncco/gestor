<template>
  <div>
    <div class="flex items-center justify-between mb-4">
      <h2 class="text-xl font-semibold">Listado de Vehículos</h2>
      <n-input
        v-model:value="searchPlaca"
        placeholder="Buscar por placa"
        clearable
        style="max-width: 250px"
      />
    </div>

    <n-data-table
      :columns="columns"
      :data="vehiculosFiltrados"
      :loading="loading"
      :bordered="false"
      :pagination="false"
      :row-class-name="getRowClass"
    />

    <ActualizarKmModal
      v-if="modalVisible"
      :visible="modalVisible"
      :vehicle-id="selectedId"
      @close="closeModal"
      @saved="onKmActualizado"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, h } from 'vue'
import { NButton, NInput, NDataTable } from 'naive-ui'
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