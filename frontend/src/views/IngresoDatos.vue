<template>
  <div class="space-y-8 p-6">
    <!-- Formulario -->
    <section class="bg-white light:bg-neutral-900 rounded-lg shadow p-6 space-y-4">
      <FormularioIngreso @datos-enviados="handleDatosEnviados" />
    </section>

    <!-- Separador -->
    <div class="relative">
      <div class="absolute inset-0 flex items-center">
        <div class="w-full border-t border-gray-300 dark:border-neutral-700" />
      </div>
      <div class="relative flex justify-center">
        <span class="bg-gray-50 light:bg-neutral-900 px-2 text-sm text-gray-500">O</span>
      </div>
    </div>

    <!-- Carga CSV -->
    <section class="bg-white light:bg-neutral-900 rounded-lg shadow p-6 space-y-4">
      <h2 class="text-lg font-semibold text-gray-700 white:text-gray-200">Carga de Archivo CSV</h2>
      <CargaCSV @csv-cargado="handleCsvCargado" />
    </section>
  </div>
</template>

<script setup>
import FormularioIngreso from '../components/operaciones/FormularioOperaciones.vue';
import CargaCSV from '../components/CargaCSV.vue';

import { useIngresoDatos } from '../composables/operaciones/useIngresoDatos';
const { handleDatosEnviados, handleCsvCargado } = useIngresoDatos();
</script>