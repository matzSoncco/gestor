<!-- src/components/OpTable.vue -->
<template>
  <div class="operations-table">
    <h2>Listado de Operaciones</h2>
    <table>
      <thead>
        <tr>
          <th>Número Documento</th>
          <th>RUC Proveedor</th>
          <th>Nombre Proveedor</th>
          <th>Tipo Operación</th>
          <th>Fecha</th>
          <th>Ver Detalle</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="op in operaciones" :key="op.id">
          <td>{{ op.numeroDocumento }}</td>
          <td>{{ op.rucProveedor }}</td>
          <td>{{ op.nombreProveedor }}</td>
          <td>{{ op.tipoOperacion }}</td>
          <td>{{ op.fecha }}</td>
          <td>
            <router-link :to="{ name: 'OpView', params: { id: op.id } }">
              Detalle
            </router-link>
          </td>
        </tr>
        <tr v-if="operaciones.length === 0">
          <td colspan="8">No hay operaciones registradas.</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '../services/api.js';
import { useRouter } from 'vue-router'

const operaciones = ref([])
const router = useRouter()
const error = ref(null)

onMounted(async () => {
  try {
    const response = await api.get('operaciones/')
    operaciones.value = response.data
  } catch (err) {
    console.error('Error al obtener operaciones:', err)
    error.value = err
  }
})
</script>

<style scoped>
.operations-table {
  padding: 1rem;
}

.operations-table table {
  width: 100%;
  border-collapse: collapse;
}

.operations-table th,
.operations-table td {
  border: 1px solid #ddd;
  padding: 0.5rem;
  text-align: left;
}

.operations-table th {
  background-color: #ca6565;
}

/* .operations-table tbody tr:hover {
  background-color: #e09090;
} */

.operations-table a {
  color: #42b983;
  text-decoration: none;
}

.operations-table a:hover {
  text-decoration: underline;
}
</style>