<template>
  <div class="space-y-8 p-6">
    <!-- Formulario -->
    <section class="bg-white light:bg-neutral-900 rounded-lg shadow p-6 space-y-4">
      <FormularioIngreso @datos-enviados="handleDatosEnviados" />
    </section>
  </div>
</template>

<script setup>
import FormularioIngreso from '@/components/operaciones/FormularioOperaciones.vue';

import { useIngresoDatos } from '../composables/operaciones/useIngresoDatos';
const { handleDatosEnviados, handleCsvCargado } = useIngresoDatos();
</script>