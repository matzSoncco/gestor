<template>
  <div>
    <h1>Vehículos</h1>
    <router-link :to="{ name: 'VehiculoNew' }">Crear Vehículo</router-link>
    <VehiculosTable />
  </div>
</template>

<script setup>
import VehiculosTable from '../components/VehiTable.vue';
</script>