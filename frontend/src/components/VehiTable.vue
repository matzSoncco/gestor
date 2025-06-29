<template>
  <div class="vehiculos-table">
    <h2>Listado de Vehículos</h2>
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
        <tr v-for="v in vehiculos" :key="v.id">
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
            >Actualizar Kilometraje</button>
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
import { ref, onMounted } from 'vue'
import { useVehiculos } from '../composables/useVehiculo.js'
import ActualizarKmModal from './ActualizarKmModal.vue'

const { vehiculos, error, loading, fetchVehiculos } = useVehiculos()

const modalVisible = ref(false)
const selectedId = ref(null)

onMounted(() => {
  fetchVehiculos()
})

const openModal = (id) => {
  selectedId.value = id
  modalVisible.value = true
}

const closeModal = () => {
  modalVisible.value = false
  selectedId.value = null
}

// Cuando el modal emite saved con el objeto actualizado,
// actualizamos la lista localmente sin volver a fetch completo
const onKmActualizado = (updatedVehiculo) => {
  // Buscar en vehiculos por id y actualizar el campo kilometraje (y otros si quieres)
  const idx = vehiculos.value.findIndex(v => v.id === updatedVehiculo.id)
  if (idx !== -1) {
    // Reemplazar todo el objeto o solo el campo necesario:
    vehiculos.value[idx] = {
      ...vehiculos.value[idx],
      kilometraje: updatedVehiculo.kilometraje
      // si hay otros campos devueltos que quieras actualizar, añádelos
    }
  }
  closeModal()
}
</script>

<style scoped>
.vehiculos-table {
  padding: 1rem;
}
.vehiculos-table table {
  width: 100%;
  border-collapse: collapse;
}
.vehiculos-table th,
.vehiculos-table td {
  border: 1px solid #ddd;
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