<template>
  <div class="vehiculos-table">
    <h2>Listado de Vehículos</h2>

    <!-- Búsqueda por placa -->
    <input
      v-model="searchPlaca"
      placeholder="Buscar por placa"
      class="search-input"
    />

    <table>
      <thead>
        <tr>
          <th>Placa</th>
          <th>Marca</th>
          <th>Kilometraje</th>
          <th>VIN</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        <!-- Ahora iteramos sobre vehiculosFiltrados y aplicamos .warning -->
        <tr
          v-for="v in vehiculosFiltrados"
          :key="v.id"
          :class="{ warning: v.kilometraje >= threshold }"
        >
          <td>{{ v.placa }}</td>
          <td>{{ v.marca }}</td>
          <td>{{ v.kilometraje }}</td>
          <td>{{ v.vin }}</td>
          <td>
            <router-link :to="{ name: 'VehiculoDetails', params: { id: v.id } }">
              Ver
            </router-link>
            |
            <button
              @click="openModal(v.id)"
              class="text-blue-600 hover:underline"
            >
              Actualizar Kilometraje
            </button>
          </td>
        </tr>
        <tr v-if="!loading && vehiculos.length === 0">
          <td colspan="5">No hay vehículos registrados.</td>
        </tr>
      </tbody>
    </table>

    <div v-if="error" class="error">
      Error al cargar vehículos: {{ error.message || error }}
    </div>
    <div v-if="loading" class="mt-2">
      Cargando vehículos...
    </div>

    <!-- Modal de actualización -->
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
import { ref, computed, onMounted } from 'vue'
import { useVehiculos } from '../../composables/vehiculos/useVehiculo'
import ActualizarKmModal from '../../components/modals/ActualizarKmModal.vue'

const { vehiculos, error, loading, fetchVehiculos } = useVehiculos()

// Umbral configurable (podrás traerlo luego desde el backend)
const threshold = ref(300)

// Estado del modal
const modalVisible = ref(false)
const selectedId = ref(null)

// Búsqueda
const searchPlaca = ref('')

// Al montar, traemos los datos
onMounted(fetchVehiculos)

// Computed que aplica el filtro por placa
const vehiculosFiltrados = computed(() =>
  vehiculos.value.filter(v =>
    v.placa.toLowerCase().includes(searchPlaca.value.toLowerCase())
  )
)

// Métodos para el modal
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
</script>

<style scoped>
.vehiculos-table {
  padding: 1rem;
}

.search-input {
  margin-bottom: 1rem;
  padding: 0.5rem;
  border-radius: 6px;
  border: 1px solid #555;
  background-color: #1e1e1e;
  color: #fff;
  width: 100%;
}

.warning {
  background-color: rgba(255, 102, 102, 0.4); /* rojo claro semitransparente */
}

.vehiculos-table table {
  width: 100%;
  border-collapse: collapse;
}
.vehiculos-table th,
.vehiculos-table td {
  border: 1px solid #444;
  padding: 0.5rem;
  text-align: left;
}
.vehiculos-table th {
  background-color: #ca6565;
}
.vehiculos-table a,
.vehiculos-table button {
  color: #42b983;
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
}
.vehiculos-table button:hover {
  text-decoration: underline;
}
.error {
  margin-top: 1rem;
  color: #e74c3c;
}
</style>