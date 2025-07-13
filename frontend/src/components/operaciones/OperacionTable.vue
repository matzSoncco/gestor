<template>
  <div class="space-y-4">
    <n-page-header title="Listado de Operaciones" subtitle="Consulta y gestiona operaciones registradas" />

    <!-- Filtros -->
    <div class="flex flex-col md:flex-row gap-3">
      <n-input
        v-model:value="searchDoc"
        placeholder="Buscar por número de documento"
        clearable
        class="w-full md:w-1/3"
      />
      <n-date-picker
        v-model:formatted-value="fechaInicio"
        type="date"
        placeholder="Fecha inicio"
        class="w-full md:w-1/4"
        clearable
      />
      <n-date-picker
        v-model:formatted-value="fechaFin"
        type="date"
        placeholder="Fecha fin"
        class="w-full md:w-1/4"
        clearable
      />
    </div>

    <!-- Tabla de operaciones -->
    <n-data-table
      :columns="columns"
      :data="operacionesFiltradas"
      :loading="loading"
      :bordered="false"
      :pagination="false"
      class="mt-4"
    />

    <n-alert v-if="error" type="error" :title="'Error al cargar'" :description="error.message || error" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, h } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/services/api'

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