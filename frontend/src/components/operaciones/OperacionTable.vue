<template>
  <div class="operations-table">
    <h2>Listado de Operaciones</h2>

    <!-- Filtros -->
    <div class="filters">
      <input
        v-model="searchDoc"
        placeholder="Buscar por número de documento"
        class="filter-input"
      />
      <input
        type="date"
        v-model="fechaInicio"
        class="filter-input date-input"
      />
      <input
        type="date"
        v-model="fechaFin"
        class="filter-input date-input"
      />
    </div>

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
        <tr v-for="op in operacionesFiltradas" :key="op.id">
          <td>{{ op.numero_documento }}</td>
          <td>{{ op.ruc_proveedor }}</td>
          <td>{{ op.nombre_proveedor }}</td>
          <td>{{ op.tipo_operacion }}</td>
          <td>{{ op.fecha }}</td>
          <td>
            <router-link :to="{ name: 'OpDetails', params: { id: op.id } }">
              Detalle
            </router-link>
          </td>
        </tr>
        <tr v-if="!loading && operaciones.length === 0">
          <td colspan="6">No hay operaciones registradas.</td>
        </tr>
      </tbody>
    </table>

    <div v-if="error" class="error">
      Error al cargar operaciones: {{ error.message || error }}
    </div>
    <div v-if="loading" class="mt-2">
      Cargando operaciones registradas...
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import api from '../../services/api'

// Datos
const operaciones = ref([])
const error = ref(null)
const loading = ref(true)

// Filtros
const searchDoc = ref('')
const fechaInicio = ref('')
const fechaFin = ref('')

// Fetch inicial
onMounted(async () => {
  try {
    const resp = await api.get('operaciones/')
    operaciones.value = resp.data
  } catch (err) {
    error.value = err
  } finally {
    loading.value = false
  }
})

// Computed que filtra por documento y rango de fecha
const operacionesFiltradas = computed(() =>
  operaciones.value.filter(op => {
    // Filtrado por número de documento
    const matchDoc = op.numero_documento
      .toLowerCase()
      .includes(searchDoc.value.toLowerCase())

    // Filtrado por rango de fecha
    const fechaOp = new Date(op.fecha)
    const ini = fechaInicio.value ? new Date(fechaInicio.value) : null
    const fin = fechaFin.value ? new Date(fechaFin.value) : null
    const matchFecha =
      (!ini || fechaOp >= ini) && (!fin || fechaOp <= fin)

    return matchDoc && matchFecha
  })
)
</script>

<style scoped>
.operations-table {
  padding: 1rem;
}

.filters {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.filter-input {
  padding: 0.4rem;
  border: 1px solid #555;
  border-radius: 4px;
  background: #1e1e1e;
  color: #fff;
}

.date-input {
  width: 150px;
}

.operations-table table {
  width: 100%;
  border-collapse: collapse;
}

.operations-table th,
.operations-table td {
  border: 1px solid #444;
  padding: 0.5rem;
  text-align: left;
}

.operations-table th {
  background-color: #ca6565;
}

.operations-table a {
  color: #42b983;
  text-decoration: none;
}

.operations-table a:hover {
  text-decoration: underline;
}

.error {
  margin-top: 1rem;
  color: #e74c3c;
}
</style>