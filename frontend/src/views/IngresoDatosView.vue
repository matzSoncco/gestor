<template>
  <div class="ingreso-datos-view">
    <h1>Ingreso de Datos</h1>
    <p>Utiliza los formularios a continuación para ingresar datos manualmente o cargar un archivo CSV.</p>

    <section class="form-section">
      <h2>Formulario de Ingreso Manual</h2>
      <FormularioIngreso @datos-enviados="handleDatosEnviados" />
    </section>

    <hr class="section-divider" />

    <section class="csv-section">
      <h2>Carga de Archivo CSV</h2>
      <CargaCSV @csv-cargado="handleCsvCargado" />
    </section>

    <div v-if="mensajeGlobal" :class="['mensaje-global', tipoMensajeGlobal]">
      {{ mensajeGlobal }}
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import FormularioIngreso from '../components/FormularioIngreso.vue'
import CargaCSV from '../components/CargaCSV.vue'

const mensajeGlobal = ref('');
const tipoMensajeGlobal = ref(''); // 'success' o 'error'

const mostrarMensaje = (mensaje, tipo = 'success', duracion = 3000) => {
  mensajeGlobal.value = mensaje;
  tipoMensajeGlobal.value = tipo;
  setTimeout(() => {
    mensajeGlobal.value = '';
    tipoMensajeGlobal.value = '';
  }, duracion);
};

const handleDatosEnviados = (respuesta) => {
  // respuesta podría ser un objeto { success: true, message: '...' } o similar
  if (respuesta.success) {
    mostrarMensaje(respuesta.message || 'Datos del formulario enviados correctamente.', 'success');
  } else {
    mostrarMensaje(respuesta.message || 'Error al enviar datos del formulario.', 'error');
  }
}

const handleCsvCargado = (respuesta) => {
  if (respuesta.success) {
    mostrarMensaje(respuesta.message || 'Archivo CSV procesado correctamente.', 'success');
  } else {
    mostrarMensaje(respuesta.message || 'Error al procesar archivo CSV.', 'error');
  }
}
</script>

<style scoped>
.ingreso-datos-view {
  max-width: 800px;
  margin: 0 auto;
}

.form-section, .csv-section {
  background-color: #f9f9f9;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 30px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
}

.section-divider {
  margin: 40px 0;
  border: 0;
  border-top: 1px solid #eee;
}

.mensaje-global {
  padding: 10px;
  border-radius: 4px;
  margin-top: 20px;
  text-align: center;
}
.mensaje-global.success {
  background-color: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
}
.mensaje-global.error {
  background-color: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
}
</style>