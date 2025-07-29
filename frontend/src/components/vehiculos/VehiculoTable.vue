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
          <n-input
            v-model:value="filtros.placa"
            placeholder="Buscar por placa"
            clearable
            class="w-full md:w-64"
            @keyup.enter="aplicarFiltros"
          />
          <n-button @click="aplicarFiltros" type="primary">Buscar</n-button>
        </div>
      </div>

      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <template v-if="!loadError">
          <div class="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100">
            <div class="min-w-[900px]">
              <n-data-table
                :columns="columns"
                :data="vehiculos"
                :loading="loading"
                remote
                :row-class-name="getRowClassName"
                :row-key="rowKey"
              >
                <template #empty>
                  <div class="text-center text-gray-500">
                    No se encontraron Vehículos Registrados.
                  </div>
                </template>
              </n-data-table>
            </div>
          </div>
          
          <div class="flex justify-end mt-4">
          <n-pagination
            v-model:page="pagination.page"
            :page-size="pagination.pageSize"
            :item-count="pagination.itemCount"
            @update:page="handlePageChange"
          />
        </div>
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
import { useRouter } from 'vue-router'
import ActualizarKmModal from '@/components/modals/ActualizarKmModal.vue'
import { useVehiculos } from '@/composables/vehiculos/useVehiculos'
import { registrarMantenimiento } from '@/api/vehiculos'
import { useVehiculoStore } from '@/stores/vehiculoStore'
import { Vehiculo } from '@/types/vehiculo'
import { useNotify } from '@/composables/global/useNotify'

const router = useRouter()
const vehiculoStore = useVehiculoStore()
const { success, error, info } = useNotify()

const {
  vehiculos,
  loading,
  currentPage,
  pageSize,
  total,
  setPage,
  loadData,
  filtros,
  aplicarFiltros,
  updateVehiculo,
  updateVehiculoInBothSources
} = useVehiculos()

const modalVisible = ref<boolean>(false)
const selectedId = ref<number | null>(null)
const loadError = ref<boolean>(false)

onMounted(async () => {
  try {
    await loadData()
    loadError.value = false
  } catch {
    loadError.value = true
  }
})

const reintentarCarga = async () => {
  loadError.value = false
  try {
    await loadData()
  } catch {
    loadError.value = true
  }
}

const pagination = computed(() => ({
  page: currentPage.value,
  pageSize: pageSize.value,
  itemCount: total.value,
}))

const handlePageChange = async (page: number) => {
  setPage(page)
}

const rowKey = (row: Vehiculo) => row.id

// const vehiculosFiltrados = computed(() =>
//   vehiculos.value.filter(v =>
//     v.placa.toLowerCase().includes(searchPlaca.value.toLowerCase())
//   )
// )

function openModal(id: number) {
  selectedId.value = id
  modalVisible.value = true
}

function closeModal() {
  modalVisible.value = false
  selectedId.value = null
}

// ⛽️ Callback cuando se actualiza el kilometraje desde el modal
const onKmActualizado = (payload: Vehiculo) => {
  const updatedVehiculo = payload
  const idx = vehiculos.value.findIndex((v) => v.id === updatedVehiculo.id)

  if (idx !== -1) {
    vehiculos.value[idx].kilometraje = updatedVehiculo.kilometraje
    vehiculos.value[idx].necesita_mantenimiento = updatedVehiculo.necesita_mantenimiento
    vehiculos.value[idx].proximo_hito_mantenimiento = updatedVehiculo.proximo_hito_mantenimiento
    vehiculos.value[idx].siguiente_hito_mantenimiento = updatedVehiculo.siguiente_hito_mantenimiento
  }

  vehiculoStore.actualizarVehiculo(updatedVehiculo)
  closeModal()
}

// 🧱 Columnas para la tabla
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
    render(row: Vehiculo) {
      return h('div', [
        `${row.kilometraje} km`,
        row.necesita_mantenimiento
          ? h('span', {
              class: 'ml-2 text-red-600 font-bold text-sm',
            }, '⚠️ Mantenimiento')
          : ''
      ])
    }
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
  {
    title: 'Mantenimiento',
    key: 'acciones',
    render(row: Vehiculo) {
      return h(
        NButton,
        {
          type: row.necesita_mantenimiento ? 'error' : 'success',
          size: 'small',
          disabled: !row.necesita_mantenimiento,
          onClick: () => handleRegistrarMantenimiento(row.id),
        },
        {
          default: () => row.necesita_mantenimiento
            ? 'Registrar mantenimiento'
            : 'Ya realizado',
        }
      )
    }
  }
]

// 🎨 Clase para fila resaltada si requiere mantenimiento
const getRowClassName = (row: Vehiculo) => {
  return row.necesita_mantenimiento ? 'row-km-alto' : ''
}

// 🔧 Acción de registrar mantenimiento
async function handleRegistrarMantenimiento(vehiculoId: number) {
  try {
    const response = await registrarMantenimiento(vehiculoId)
    const actualizado = response.data.vehiculo

    vehiculoStore.actualizarVehiculo(actualizado)

    updateVehiculoInBothSources(actualizado)

    // ✅ Notifica éxito
    success(response.data.detail)
  } catch (error: any) {
    if (error.response?.data?.detail) {
      error(error.response.data.detail)
    } else {
      error('Error al registrar mantenimiento')
    }
  }
}
</script>

<style scoped>
:deep(.row-km-alto td) {
  background-color: #fee2e2 !important;
  color: #991b1b !important;
  font-weight: 600;
}
</style>