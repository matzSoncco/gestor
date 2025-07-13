<template>
  <div class="px-6 py-4">
    <!-- Botón de regreso -->
    <button
      @click="goBack"
      class="mb-4 px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded shadow"
    >
      ← Volver
    </button>

    <h2 class="text-xl font-semibold mb-4">Detalle de Operación #{{ id }}</h2>

    <div v-if="loading" class="text-gray-500 italic">Cargando...</div>

    <div v-else-if="error" class="text-red-500">
      <p>Error al cargar la operación: {{ errorMessage }}</p>
    </div>

    <div v-else class="space-y-8">
      <!-- Información General -->
      <section>
        <h3 class="text-lg font-semibold mb-2">Información General</h3>
        <table class="w-full border border-gray-300 text-sm">
          <tbody>
            <tr v-for="(value, label) in generalInfo" :key="label">
              <th class="bg-gray-100 px-3 py-2 text-left w-1/3">{{ label }}</th>
              <td class="px-3 py-2" :class="{ 'text-red-500 font-medium': label === 'Costo Total' }">
                {{ value }}
              </td>
            </tr>
          </tbody>
        </table>
      </section>

      <!-- Combustible -->
      <section v-if="operacion.tipo_operacion === 'combustible'">
        <h3 class="text-lg font-semibold mb-2">Detalle de Combustible</h3>
        <div v-if="!operacion.combustible_detalle?.length" class="text-gray-400">No hay registros.</div>
        <table v-else class="w-full border border-gray-300 text-sm">
          <thead class="bg-gray-100">
            <tr>
              <th class="px-3 py-2">Cantidad Galones</th>
              <th class="px-3 py-2">Costo por Galón</th>
              <th class="px-3 py-2">Placa</th>
              <th class="px-3 py-2">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="c in operacion.combustible_detalle" :key="c.id" class="border-t">
              <td class="px-3 py-2">{{ c.cantidad_galones }}</td>
              <td class="px-3 py-2">S/. {{ c.costo_por_galon }}</td>
              <td class="px-3 py-2">{{ getPlacaVehiculo(c.placa_vehiculo) }}</td>
              <td class="px-3 py-2 font-semibold text-green-600">S/. {{ c.subtotal }}</td>
            </tr>
          </tbody>
        </table>
      </section>

      <!-- Mantenimiento -->
      <section v-if="operacion.tipo_operacion === 'mantenimiento'">
        <h3 class="text-lg font-semibold mb-2">Detalle de Mantenimiento</h3>
        <div v-if="!operacion.mantenimiento_detalle?.length" class="text-gray-400">No hay registros.</div>
        <table v-else class="w-full border border-gray-300 text-sm">
          <thead class="bg-gray-100">
            <tr>
              <th class="px-3 py-2">Descripción</th>
              <th class="px-3 py-2">Cantidad</th>
              <th class="px-3 py-2">Costo Unitario</th>
              <th class="px-3 py-2">Placa</th>
              <th class="px-3 py-2">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="m in operacion.mantenimiento_detalle" :key="m.id" class="border-t">
              <td class="px-3 py-2">{{ m.descripcion_item }}</td>
              <td class="px-3 py-2">{{ m.cantidad }}</td>
              <td class="px-3 py-2">S/. {{ m.costo_unitario }}</td>
              <td class="px-3 py-2">{{ getPlacaVehiculo(m.placa_vehiculo) }}</td>
              <td class="px-3 py-2 font-semibold text-green-600">S/. {{ m.subtotal }}</td>
            </tr>
          </tbody>
        </table>
      </section>

      <!-- Servicio -->
      <section v-if="operacion.tipo_operacion === 'servicio'">
        <h3 class="text-lg font-semibold mb-2">Detalle de Servicio</h3>
        <div v-if="!operacion.servicio_detalle?.length" class="text-gray-400">No hay registros.</div>
        <table v-else class="w-full border border-gray-300 text-sm">
          <thead class="bg-gray-100">
            <tr>
              <th class="px-3 py-2">Descripción</th>
              <th class="px-3 py-2">Costo Servicio</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="s in operacion.servicio_detalle" :key="s.id" class="border-t">
              <td class="px-3 py-2">{{ s.descripcion_item }}</td>
              <td class="px-3 py-2 font-semibold text-green-600">S/. {{ s.costo_servicio }}</td>
            </tr>
          </tbody>
        </table>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '../../services/api.js'

const route = useRoute()
const router = useRouter()
const id = route.params.id

const operacion = ref(null)
const vehiculos = ref([])
const loading = ref(true)
const error = ref(false)
const errorMessage = ref('')

// Ir atrás
const goBack = () => router.back()

// Formatear fecha
const formatDate = (date) => {
  if (!date) return 'No especificada'
  const d = new Date(date)
  return d.toLocaleDateString('es-PE', { year: 'numeric', month: 'long', day: 'numeric' })
}

// Obtener placa del vehículo por ID
const getPlacaVehiculo = (id) => {
  const v = vehiculos.value.find(v => v.id === id)
  return v ? v.placa : `ID: ${id}`
}

// Propiedad computada para mostrar en la tabla general
const generalInfo = computed(() => {
  if (!operacion.value) return {}
  return {
    'Número Documento': operacion.value.numero_documento,
    'RUC Proveedor': operacion.value.ruc_proveedor,
    'Nombre Proveedor': operacion.value.nombre_proveedor,
    'Tipo Operación': operacion.value.tipo_operacion,
    'Fecha': formatDate(operacion.value.fecha),
    'Descripción': operacion.value.descripcion || 'Sin descripción',
    'Costo Total': `S/. ${operacion.value.costo_total}`
  }
})

// Fetch de datos
onMounted(async () => {
  try {
    const [v, o] = await Promise.all([
      api.get('vehiculos/'),
      api.get(`operaciones/${id}/`)
    ])
    vehiculos.value = v.data
    operacion.value = o.data
  } catch (err) {
    error.value = true
    errorMessage.value = err.response?.data || 'Error desconocido'
  } finally {
    loading.value = false
  }
})
</script>