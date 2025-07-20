<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 md:p-6">
    <div class="max-w-6xl mx-auto space-y-6">
      <!-- Header -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div class="flex items-center justify-between mb-4">
          <div>
            <h1 class="text-2xl font-bold text-gray-800">Listado de Operaciones</h1>
            <p class="text-gray-500">Consulta y gestiona operaciones registradas</p>
          </div>
        </div>

        <!-- Filtros -->
        <div class="grid gap-4 md:grid-cols-3">
          <n-input
            v-model:value="filtros.numero_documento"
            placeholder="Buscar por número de documento"
            clearable
            class="w-full"
            @keyup.enter="aplicarFiltros"
          />
          <n-date-picker
            v-model:formatted-value="filtros.fecha_inicio"
            type="date"
            placeholder="Fecha inicio"
            class="w-full"
            clearable
          />
          <n-date-picker
            v-model:formatted-value="filtros.fecha_fin"
            type="date"
            placeholder="Fecha fin"
            class="w-full"
            clearable
          />
          <n-button @click="aplicarFiltros" type="primary">Buscar</n-button>
        </div>
      </div>

      <!-- Tabla -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <template v-if="!loadError">
          <div class="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100">
            <div class="min-w-[900px]">
              <n-data-table
                :columns="columns"
                :data="operaciones"
                :loading="loading"
                remote
                :row-key="rowKey"
              >
              <template #empty>
                <div class="text-center text-gray-500">
                  No se encontraron Operaciones Registradas.
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

        <n-result
          v-else
          status="error"
          class="mt-6"
          title="Error al cargar las operaciones"
          description="No se pudo conectar con el servidor. Verifica tu conexión o intenta nuevamente."
        >
          <template #footer>
            <n-button @click="reintentarCarga" type="primary">Reintentar</n-button>
          </template>
        </n-result>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, h } from 'vue'
import { useRouter } from 'vue-router'
import { useOperaciones } from '@/composables/operaciones/useOperaciones'
import { NButton } from 'naive-ui'
import { Operacion } from '@/types/operacion'

const router = useRouter()
const {
  operaciones,
  loading,
  currentPage,
  pageSize,
  total,
  setPage,
  load,
  filtros,
  aplicarFiltros
} = useOperaciones()

const loadError = ref<boolean>(false)

// Obtener operaciones
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

// Paginación Naive UI reactiva
const pagination = computed(() => ({
  page: currentPage.value,
  pageSize: pageSize.value,
  itemCount: total.value,
}))

const handlePageChange = async (page: number) => {
  setPage(page)
}

// Clave única de fila
const rowKey = (row: Operacion) => row.id

// Función formatFecha con debugging directo
function formatFecha(fecha: string) {
  try {
    if (!fecha || fecha.trim() === '') {
      return 'Sin fecha'
    }

    // Validar que tenga formato correcto YYYY-MM-DD
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    if (!regex.test(fecha)) {
      return 'Fecha inválida'
    }

    // Dividir y reordenar directamente
    const [año, mes, dia] = fecha.split('-');
    return `${dia}/${mes}/${año}`;

  } catch (error) {
    return 'Error en fecha'
  }
}

// Columnas de la tabla
const columns = [
  { title: 'N° Documento', key: 'numero_documento' },
  { title: 'RUC Proveedor', key: 'ruc_proveedor' },
  { title: 'Nombre Proveedor', key: 'nombre_proveedor' },
  { title: 'Tipo Operación', key: 'tipo_operacion' },
  {
    title: 'Fecha',
    key: 'fecha',
    render(row: Operacion) {
      return formatFecha(row.fecha)
    }
  },
  {
    title: 'Detalle',
    key: 'actions',
    render(row: Operacion) {
      return h(
        NButton,
        {
          type: 'primary',
          size: 'small',
          tertiary: true,
          onClick: () => router.push({ name: 'OpDetails', params: { id: row.id } })
        },
        { default: () => 'Ver' }
      )
    }
  }
]
</script>