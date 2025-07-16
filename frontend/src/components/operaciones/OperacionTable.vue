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
            v-model:value="searchDoc"
            placeholder="Buscar por número de documento"
            clearable
            class="w-full"
          />
          <n-date-picker
            v-model:formatted-value="fechaInicio"
            type="date"
            placeholder="Fecha inicio"
            class="w-full"
            clearable
          />
          <n-date-picker
            v-model:formatted-value="fechaFin"
            type="date"
            placeholder="Fecha fin"
            class="w-full"
            clearable
          />
        </div>
      </div>

      <!-- Tabla -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <n-data-table
          :columns="columns"
          :data="operacionesFiltradas"
          :loading="loading"
          :bordered="false"
          :pagination="false"
        />
      </div>

      <!-- Error -->
      <div v-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-3">
        <svg class="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
        <div>
          <h3 class="text-lg font-semibold text-red-800">Error al cargar</h3>
          <p class="text-red-600">{{ error.message || error }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, h } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/services/authService'

import {
  NInput,
  NDatePicker,
  NDataTable,
  NAlert,
  NButton,
  NPageHeader
} from 'naive-ui'

const router = useRouter()

// Datos
const operaciones = ref([])
const error = ref(null)
const loading = ref(true)

// Filtros
const searchDoc = ref('')
const fechaInicio = ref(null)
const fechaFin = ref(null)

// Obtener operaciones
onMounted(async () => {
  try {
    const { data } = await api.get('operaciones/')
    operaciones.value = data
  } catch (err) {
    error.value = err
  } finally {
    loading.value = false
  }
})

// Columnas de la tabla
const columns = [
  { title: 'N° Documento', key: 'numero_documento' },
  { title: 'RUC Proveedor', key: 'ruc_proveedor' },
  { title: 'Nombre Proveedor', key: 'nombre_proveedor' },
  { title: 'Tipo Operación', key: 'tipo_operacion' },
  { title: 'Fecha', key: 'fecha' },
  {
    title: 'Detalle',
    key: 'actions',
    render(row) {
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

// Filtro reactivo
const operacionesFiltradas = computed(() =>
  operaciones.value.filter(op => {
    const matchDoc = op.numero_documento.toLowerCase().includes(searchDoc.value.toLowerCase())
    const fechaOp = new Date(op.fecha)
    const ini = fechaInicio.value ? new Date(fechaInicio.value) : null
    const fin = fechaFin.value ? new Date(fechaFin.value) : null
    const matchFecha = (!ini || fechaOp >= ini) && (!fin || fechaOp <= fin)
    return matchDoc && matchFecha
  })
)
</script>