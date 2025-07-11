<template>
<div class="vehiculo-detail">
    <h2>Detalle de Vehículo: {{ vehiculo.placa || "" }}</h2>
<div v-if="loading" class="loading">Cargando datos…</div>
<div v-else-if="error" class="error">
    Error al cargar el vehículo: {{ error.message || error }}
</div>
<div v-else class="detail-grid">
    <!-- Bloque 1: Datos básicos -->
    <section>
    <h3>Datos básicos</h3>
    <p>----------------------------</p>
    <p><strong>Placa:</strong> {{ vehiculo.placa }}</p>
    <p><strong>Año:</strong> {{ vehiculo.anio }}</p>
    <p><strong>Kilometraje:</strong> {{ parseFloat(vehiculo.kilometraje).toFixed(1) }} km</p>
    <p><strong>Costo:</strong> S/ {{ parseFloat(vehiculo.costo).toFixed(2) }}</p>
    <p><strong>Ubicación:</strong> {{ vehiculo.ubicacion || "—" }}</p>
    </section>

    <!-- Bloque 2: Tarjeta del vehículo -->
    <section>
    <h3>Tarjeta del vehículo</h3>
    <p>----------------------------</p>
    <p><strong>Categoría:</strong> {{ vehiculo.categoria }}</p>
    <p><strong>Marca:</strong> {{ vehiculo.marca }}</p>
    <p><strong>Modelo:</strong> {{ vehiculo.modelo }}</p>
    <p><strong>Versión:</strong> {{ vehiculo.version || "—" }}</p>
    <p><strong>Color:</strong> {{ vehiculo.color || "—" }}</p>
    <p><strong>Año fabricación:</strong> {{ vehiculo.anio_fabricacion }}</p>
    <p><strong>Año modelo:</strong> {{ vehiculo.anio_modelo }}</p>
    <p><strong>Motor:</strong> {{ vehiculo.motor || "—" }}</p>
    <p><strong>Combustible:</strong> {{ vehiculo.combustible }}</p>
    <p><strong>Forma rodante:</strong> {{ vehiculo.forma_rodante }}</p>
    <p><strong>VIN:</strong> {{ vehiculo.vin }}</p>
    <p><strong>Serie chasis:</strong> {{ vehiculo.serie_chasis || "—" }}</p>
    <p><strong>Ejes:</strong> {{ vehiculo.ejes }}</p>
    <p><strong>Ruedas:</strong> {{ vehiculo.ruedas }}</p>
    <p><strong>Pasajeros:</strong> {{ vehiculo.pasajeros }}</p>
    <p><strong>Carrocería:</strong> {{ vehiculo.carroceria || "—" }}</p>
    </section>

    <!-- Bloque 3: Dimensiones y pesos -->
    <section>
    <h3>Dimensiones y pesos</h3>
    <p>----------------------------</p>
    <p><strong>Peso neto:</strong> {{ vehiculo.peso_neto }} kg</p>
    <p><strong>Peso bruto:</strong> {{ vehiculo.peso_bruto }} kg</p>
    <p><strong>Carga útil:</strong> {{ vehiculo.carga_util }} kg</p>
    <p><strong>Cilindrada:</strong> {{ vehiculo.cilindrada }} cc</p>
    <p><strong>Cilindros:</strong> {{ vehiculo.cilindros }}</p>
    <p><strong>Altura:</strong> {{ vehiculo.altura }} m</p>
    <p><strong>Ancho:</strong> {{ vehiculo.ancho }} m</p>
    <p><strong>Longitud:</strong> {{ vehiculo.longitud }} m</p>
    </section>

    <div class="actions">
    <router-link :to="{ name: 'VehiculoEdit', params: { id } }" class="btn">
        Editar
    </router-link>
    <router-link :to="{ name: 'Vehiculos' }" class="btn-secondary">
        Volver al listado
    </router-link>
    </div>
    </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import api from '../../services/api.js';

const route = useRoute();
const id = route.params.id;

const vehiculo = ref({});
const loading = ref(true);
const error   = ref(null);

onMounted(async () => {
  try {
    const { data } = await api.get(`vehiculos/${id}/`);
    vehiculo.value = data;
  } catch (err) {
    console.error('Error al obtener vehículo:', err);
    error.value = err;
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped>
.vehiculo-detail {
  padding: 1rem;
}
.loading {
  font-style: italic;
}
.error {
  color: #e74c3c;
}
.detail-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
}
section {
  background: #631717;
  padding: 1rem;
  border-radius: 4px;
}
.actions {
  margin-top: 1rem;
}
.btn, .btn-secondary {
  padding: 0.5rem 1rem;
  margin-right: 0.5rem;
  text-decoration: none;
  color: white;
  border-radius: 4px;
}
.btn {
  background-color: #42b983;
}
.btn-secondary {
  background-color: #777;
}
</style>