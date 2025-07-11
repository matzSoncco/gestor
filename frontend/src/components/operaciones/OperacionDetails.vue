<template>
  <div class="operation-detail">
    <button @click="goBack">← Volver</button>
    <h2>Detalle de Operación #{{ id }}</h2>
    <div v-if="loading">Cargando...</div>
    <div v-else-if="error">
      <p>Error al cargar la operación: {{ errorMessage }}</p>
    </div>
    <div v-else>
      <!-- Información general de la operación -->
      <div class="operation-info">
        <h3>Información General</h3>
        <table class="info-table">
          <tr>
            <th>Número Documento</th>
            <td>{{ operacion.numero_documento }}</td>
          </tr>
          <tr>
            <th>RUC Proveedor</th>
            <td>{{ operacion.ruc_proveedor }}</td>
          </tr>
          <tr>
            <th>Nombre Proveedor</th>
            <td>{{ operacion.nombre_proveedor }}</td>
          </tr>
          <tr>
            <th>Tipo Operación</th>
            <td class="tipo-operacion">{{ operacion.tipo_operacion }}</td>
          </tr>
          <tr>
            <th>Fecha</th>
            <td>{{ formatDate(operacion.fecha) }}</td>
          </tr>
          <tr>
            <th>Descripción</th>
            <td>{{ operacion.descripcion || 'Sin descripción' }}</td>
          </tr>
          <tr>
            <th>Costo Total</th>
            <td class="costo-total">S/. {{ operacion.costo_total }}</td>
          </tr>
        </table>
      </div>

      <!-- Detalle de Combustible -->
      <div v-if="operacion.tipo_operacion === 'combustible'" class="detail-section">
        <h3>Detalle de Combustible</h3>
        <div v-if="!operacion.combustible_detalle || operacion.combustible_detalle.length === 0">
          <p class="no-data">No hay registros de combustible para esta operación.</p>
        </div>
        <table v-else class="detail-table">
          <thead>
            <tr>
              <th>Cantidad Galones</th>
              <th>Costo por Galón</th>
              <th>Placa Vehículo</th>
              <th>Subtotal</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="c in operacion.combustible_detalle" :key="c.id">
              <td>{{ c.cantidad_galones }}</td>
              <td>S/. {{ c.costo_por_galon }}</td>
              <td>{{ getPlacaVehiculo(c.placa_vehiculo) }}</td>
              <td class="subtotal">S/. {{ c.subtotal }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Detalle de Mantenimiento -->
      <div v-if="operacion.tipo_operacion === 'mantenimiento'" class="detail-section">
        <h3>Detalle de Mantenimiento</h3>
        <div v-if="!operacion.mantenimiento_detalle || operacion.mantenimiento_detalle.length === 0">
          <p class="no-data">No hay registros de mantenimiento para esta operación.</p>
        </div>
        <table v-else class="detail-table">
          <thead>
            <tr>
              <th>Descripción</th>
              <th>Cantidad</th>
              <th>Costo Unitario</th>
              <th>Placa Vehículo</th>
              <th>Subtotal</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="m in operacion.mantenimiento_detalle" :key="m.id">
              <td>{{ m.descripcion_item }}</td>
              <td>{{ m.cantidad }}</td>
              <td>S/. {{ m.costo_unitario }}</td>
              <td>{{ getPlacaVehiculo(m.placa_vehiculo) }}</td>
              <td class="subtotal">S/. {{ m.subtotal }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Detalle de Servicio -->
      <div v-if="operacion.tipo_operacion === 'servicio'" class="detail-section">
        <h3>Detalle de Servicio</h3>
        <div v-if="!operacion.servicio_detalle || operacion.servicio_detalle.length === 0">
          <p class="no-data">No hay registros de servicio para esta operación.</p>
        </div>
        <table v-else class="detail-table">
          <thead>
            <tr>
              <th>Descripción</th>
              <th>Costo Servicio</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="s in operacion.servicio_detalle" :key="s.id">
              <td>{{ s.descripcion_item }}</td>
              <td class="subtotal">S/. {{ s.costo_servicio }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '../../services/api.js'

const route = useRoute()
const router = useRouter()
const id = route.params.id

const operacion = ref(null)
const loading = ref(true)
const error = ref(false)
const errorMessage = ref('')
const vehiculos = ref([])

const goBack = () => {
  router.back()
}

// Función para formatear fecha
const formatDate = (dateString) => {
  if (!dateString) return 'No especificada'
  const date = new Date(dateString)
  return date.toLocaleDateString('es-PE', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

// Función para obtener la placa del vehículo
const getPlacaVehiculo = (vehiculoId) => {
  if (!vehiculoId) return 'No especificado'
  const vehiculo = vehiculos.value.find(v => v.id === vehiculoId)
  return vehiculo ? vehiculo.placa : `ID: ${vehiculoId}`
}

// Cargar lista de vehículos para mostrar las placas
const cargarVehiculos = async () => {
  try {
    const response = await api.get('vehiculos/')
    vehiculos.value = response.data
  } catch (err) {
    console.warn('No se pudieron cargar los vehículos:', err)
  }
}

onMounted(async () => {
  try {
    // Cargar vehículos primero
    await cargarVehiculos()
    
    // Luego cargar la operación
    const response = await api.get(`operaciones/${id}/`)
    operacion.value = response.data
  } catch (err) {
    console.error('Error al cargar la operación:', err)
    error.value = true
    if (err.response && err.response.data) {
      errorMessage.value = JSON.stringify(err.response.data)
    } else {
      errorMessage.value = 'Error de red o servidor.'
    }
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.operation-detail {
  padding: 1rem;
}

.operation-detail button {
  margin-bottom: 1rem;
  padding: 0.3rem 0.6rem;
  background-color: #c24d4d;
  border: 1px solid #ccc;
  border-radius: 4px;
  cursor: pointer;
}

.operation-detail button:hover {
  background-color: #da5858;
}

.operation-detail table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 1.5rem;
}

.operation-detail th,
.operation-detail td {
  border: 1px solid #ddd;
  padding: 0.5rem;
  text-align: left;
}

.operation-detail th {
  background-color: #d15656;
}
</style>