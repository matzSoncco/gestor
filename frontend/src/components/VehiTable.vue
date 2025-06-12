<!-- src/components/VehiculosTable.vue -->
<template>
  <div class="vehiculos-table">
    <h2>Listado de Vehículos</h2>
    <table>
      <thead>
        <tr>
          <th>Placa</th>
          <th>Año</th>
          <th>Marca</th>
          <th>Modelo</th>
          <th>VIN</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="v in vehiculos" :key="v.id">
          <td>{{ v.placa }}</td>
          <td>{{ v.anio }}</td>
          <td>{{ v.marca }}</td>
          <td>{{ v.modelo }}</td>
          <td>{{ v.vin }}</td>
          <td>
            <router-link :to="{ name: 'VehiculoView', params: { id: v.id } }">
              Ver
            </router-link>
            |
            <router-link :to="{ name: 'VehiculoEdit', params: { id: v.id } }">
              Editar
            </router-link>
          </td>
        </tr>
        <tr v-if="vehiculos.length === 0">
          <td colspan="6">No hay vehículos registrados.</td>
        </tr>
      </tbody>
    </table>
    <div v-if="error" class="error">
      Error al cargar vehículos: {{ error.message || error }}
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import api from '../services/api.js';


const vehiculos = ref([]);
const error     = ref(null);

onMounted(async () => {
  try {
    const { data } = await api.get('vehiculos/');
    vehiculos.value = data;
  } catch (err) {
    console.error('Error al obtener vehículos:', err);
    error.value = err;
  }
});
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
.vehiculos-table a {
  color: #42b983;
  text-decoration: none;
}
.vehiculos-table a:hover {
  text-decoration: underline;
}
.error {
  margin-top: 1rem;
  color: #e74c3c;
}
</style>