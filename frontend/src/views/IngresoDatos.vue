<template>
  <div class="ingreso-datos-view">
    <h1>Registro de Operaciones</h1>
    <p>Utiliza los formularios a continuación para ingresar datos manualmente o cargar un archivo CSV.</p>

    <section class="form-section">
      <h2>Formulario de Registro para Operaciones</h2>
      <FormularioIngreso @datos-enviados="handleDatosEnviados" />
    </section>

    <hr class="section-divider" />

    <section class="csv-section">
      <h2>Carga de Archivo CSV</h2>
      <CargaCSV @csv-cargado="handleCsvCargado" />
    </section>
  </div>
</template>

<script setup>
import FormularioIngreso from '../components/operaciones/FormularioIngreso.vue';
import CargaCSV from '../components/CargaCSV.vue';

import { useIngresoDatos } from '../composables/operaciones/useIngresoDatos';
const { handleDatosEnviados, handleCsvCargado } = useIngresoDatos();

import '../assets/styles/IngresoDatos.css';
</script>