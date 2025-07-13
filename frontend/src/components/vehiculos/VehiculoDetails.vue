<template>
  <div class="space-y-6">
    <n-page-header
      title="Detalle de Vehículo"
      subtitle="Información completa del vehículo seleccionado"
    >
      <template #extra>
        <div class="flex gap-3">
          <n-button type="primary" @click="goToEdit">Editar</n-button>
          <n-button secondary @click="goBack">Volver</n-button>
        </div>
      </template>
    </n-page-header>

    <n-alert v-if="loading" type="info" title="Cargando datos..." />

    <n-alert v-else-if="error" type="error" :title="'Error al cargar vehículo'" :description="error.message || error" />

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <!-- Bloque 1 -->
      <n-card title="Datos básicos" size="small">
        <p><strong>Placa:</strong> {{ vehiculo.placa }}</p>
        <p><strong>Año:</strong> {{ vehiculo.anio }}</p>
        <p><strong>Kilometraje:</strong> {{ parseFloat(vehiculo.kilometraje).toFixed(1) }} km</p>
        <p><strong>Costo:</strong> S/ {{ parseFloat(vehiculo.costo).toFixed(2) }}</p>
        <p><strong>Ubicación:</strong> {{ vehiculo.ubicacion || "—" }}</p>
      </n-card>

      <!-- Bloque 2 -->
      <n-card title="Tarjeta del vehículo" size="small">
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
      </n-card>

      <!-- Bloque 3 -->
      <n-card title="Dimensiones y pesos" size="small">
        <p><strong>Peso neto:</strong> {{ vehiculo.peso_neto }} kg</p>
        <p><strong>Peso bruto:</strong> {{ vehiculo.peso_bruto }} kg</p>
        <p><strong>Carga útil:</strong> {{ vehiculo.carga_util }} kg</p>
        <p><strong>Cilindrada:</strong> {{ vehiculo.cilindrada }} cc</p>
        <p><strong>Cilindros:</strong> {{ vehiculo.cilindros }}</p>
        <p><strong>Altura:</strong> {{ vehiculo.altura }} m</p>
        <p><strong>Ancho:</strong> {{ vehiculo.ancho }} m</p>
        <p><strong>Longitud:</strong> {{ vehiculo.longitud }} m</p>
      </n-card>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '@/services/api.js'

import {
  NAlert,
  NCard,
  NPageHeader,
  NButton
} from 'naive-ui'

const route = useRoute()
const router = useRouter()
const id = route.params.id

const vehiculo = ref({})
const loading = ref(true)
const error = ref(null)

onMounted(async () => {
  try {
    const { data } = await api.get(`vehiculos/${id}/`)
    vehiculo.value = data
  } catch (err) {
    console.error('Error al obtener vehículo:', err)
    error.value = err
  } finally {
    loading.value = false
  }
})

const goToEdit = () => {
  router.push({ name: 'VehiculoEdit', params: { id } })
}
const goBack = () => {
  router.push({ name: 'Vehiculos' })
}
</script>