<template>
  <div class="carga-csv">
    <div class="form-group">
      <label for="archivoCsv">Selecciona un archivo CSV:</label>
      <input type="file" id="archivoCsv" @change="handleFileChange" accept=".csv" />
    </div>

    <div v-if="archivoSeleccionado">
      <p>Archivo seleccionado: <strong>{{ archivoSeleccionado.name }}</strong></p>
    </div>
    
    <div v-if="mensaje" :class="['mensaje', tipoMensaje]">
      {{ mensaje }}
    </div>

    <button @click="subirArchivo" :disabled="!archivoSeleccionado || loading">
      {{ loading ? 'Cargando...' : 'Cargar y Procesar CSV' }}
    </button>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import apiService from '../services/apiService';

const emit = defineEmits(['csv-cargado']);

const archivoSeleccionado = ref(null);
const loading = ref(false);
const mensaje = ref('');
const tipoMensaje = ref(''); // 'success' o 'error'

const mostrarMensajeLocal = (msg, tipo = 'success', duracion = 3000) => {
  mensaje.value = msg;
  tipoMensaje.value = tipo;
  setTimeout(() => {
    mensaje.value = '';
    tipoMensaje.value = '';
  }, duracion);
};

const handleFileChange = (event) => {
  const file = event.target.files[0];
  if (file && file.type === "text/csv") {
    archivoSeleccionado.value = file;
    mostrarMensajeLocal(''); // Limpiar mensaje anterior
  } else {
    archivoSeleccionado.value = null;
    mostrarMensajeLocal('Por favor, selecciona un archivo .csv válido.', 'error');
  }
};

const subirArchivo = async () => {
  if (!archivoSeleccionado.value) {
    mostrarMensajeLocal('No hay archivo seleccionado.', 'error');
    return;
  }

  loading.value = true;
  const formData = new FormData();
  formData.append('file', archivoSeleccionado.value); // 'file' debe coincidir con el nombre esperado en Django

  try {
    const response = await apiService.uploadCsvFile(formData);
    mostrarMensajeLocal('Archivo CSV cargado y procesado correctamente.', 'success');
    emit('csv-cargado', { success: true, message: 'Archivo CSV procesado con éxito.', data: response.data });
    archivoSeleccionado.value = null; // Limpiar selección
    document.getElementById('archivoCsv').value = null; // Resetear el input file
  } catch (error) {
    console.error('Error al cargar CSV:', error);
    const errorMsg = error.response?.data?.detail || error.message || 'Error desconocido al procesar el archivo.';
    mostrarMensajeLocal(`Error: ${errorMsg}`, 'error');
    emit('csv-cargado', { success: false, message: `Error al procesar CSV: ${errorMsg}` });
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.carga-csv {
  display: flex;
  flex-direction: column;
  gap: 15px;
}
.form-group {
  display: flex;
  flex-direction: column;
}
.form-group label {
  margin-bottom: 5px;
  font-weight: bold;
}
.form-group input[type="file"] {
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 16px; /* Ajusta según necesites */
}
button {
  background-color: #17a2b8; /* Un color diferente para este botón */
  color: white;
  padding: 10px 15px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.2s;
}
button:disabled {
  background-color: #aaa;
  cursor: not-allowed;
}
button:hover:not(:disabled) {
  background-color: #138496;
}
.mensaje {
  padding: 10px;
  border-radius: 4px;
  margin-top: 5px;
  text-align: center;
}
.mensaje.success {
  background-color: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
}
.mensaje.error {
  background-color: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
}
</style>