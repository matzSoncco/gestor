<!-- src/components/OpView.vue -->
<template>
  <div class="operation-detail">
    <button @click="goBack">← Volver</button>
    <h2>Detalle de Operación #{{ id }}</h2>
    <div v-if="loading">Cargando...</div>
    <div v-else-if="error">
      <p>Error al cargar la operación: {{ errorMessage }}</p>
    </div>
    <div v-else>
      <table>
        <tr>
          <th>ID</th>
          <td>{{ operacion.id }}</td>
        </tr>
        <tr>
          <th>Número Documento</th>
          <td>{{ operacion.numeroDocumento }}</td>
        </tr>
        <tr>
          <th>RUC Proveedor</th>
          <td>{{ operacion.rucProveedor }}</td>
        </tr>
        <tr>
          <th>Nombre Proveedor</th>
          <td>{{ operacion.nombreProveedor }}</td>
        </tr>
        <tr>
          <th>Tipo Operación</th>
          <td>{{ operacion.tipoOperacion }}</td>
        </tr>
        <tr>
          <th>Fecha</th>
          <td>{{ operacion.fecha }}</td>
        </tr>
        <tr>
          <th>Descripción</th>
          <td>{{ operacion.descripcion }}</td>
        </tr>
      </table>

      <h3>Detalle de Combustible</h3>
      <div v-if="!operacion.combustible_detalle || operacion.combustible_detalle.length === 0">
        <p>No hay registros de combustible para esta operación.</p>
      </div>
      <table v-else>
        <thead>
          <tr>
            <th>ID</th>
            <th>Cantidad Galones</th>
            <th>Costo por Galón</th>
            <th>SubTotal</th>
            <th>Placa Vehículo</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="c in operacion.combustible_detalle" :key="c.id">
            <td>{{ c.id }}</td>
            <td>{{ c.cantidadGalones }}</td>
            <td>{{ c.costoPorGalon }}</td>
            <td>{{ c.subTotal }}</td>
            <td>{{ c.placaVehiculo }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '../services/api.js';

const route = useRoute()
const router = useRouter()
const id = route.params.id

const operacion = ref(null)
const loading = ref(true)
const error = ref(false)
const errorMessage = ref('')

const goBack = () => {
  router.back()
}

onMounted(async () => {
  try {
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