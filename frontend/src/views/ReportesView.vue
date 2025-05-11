<template>
  <div class="reportes-view">
    <h1>Generación de Reportes</h1>
    <p>Selecciona el formato del reporte que deseas generar.</p>

    <div class="botones-reporte">
      <button @click="generarReporte('excel')" :disabled="loadingExcel">
        {{ loadingExcel ? 'Generando Excel...' : 'Generar Reporte Excel (.xlsx)' }}
      </button>
      <button @click="generarReporte('pdf')" :disabled="loadingPdf">
        {{ loadingPdf ? 'Generando PDF...' : 'Generar Reporte PDF (.pdf)' }}
      </button>
    </div>

    <div v-if="mensaje" :class="['mensaje', tipoMensaje]">
      {{ mensaje }}
    </div>

    </div>
</template>

<script setup>
import { ref } from 'vue';
import apiService from '../services/apiService';

const loadingExcel = ref(false);
const loadingPdf = ref(false);
const mensaje = ref('');
const tipoMensaje = ref(''); // 'success' o 'error'

// const filtros = ref({ // Ejemplo de filtros
//   fechaInicio: '',
//   fechaFin: '',
// });

const mostrarMensaje = (msg, tipo = 'success', duracion = 4000) => {
  mensaje.value = msg;
  tipoMensaje.value = tipo;
  setTimeout(() => {
    mensaje.value = '';
    tipoMensaje.value = '';
  }, duracion);
};

const generarReporte = async (formato) => {
  if (formato === 'excel') {
    loadingExcel.value = true;
  } else if (formato === 'pdf') {
    loadingPdf.value = true;
  }

  try {
    // const params = { ...filtros.value }; // Pasar filtros si los tienes
    const response = await apiService.generateReport(formato /*, params */);
    
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    // El backend debería enviar Content-Disposition con el nombre del archivo.
    // Si no, podemos intentar extraerlo o generar uno.
    const contentDisposition = response.headers['content-disposition'];
    let fileName = `reporte.${formato}`;
    if (contentDisposition) {
        const fileNameMatch = contentDisposition.match(/filename="?(.+)"?/i);
        if (fileNameMatch && fileNameMatch.length > 1) {
            fileName = fileNameMatch[1];
        }
    }
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    mostrarMensaje(`Reporte ${formato.toUpperCase()} generado y descargado.`, 'success');

  } catch (error) {
    console.error(`Error generando reporte ${formato}:`, error);
    mostrarMensaje(`Error al generar el reporte ${formato.toUpperCase()}. ${error.message || ''}`, 'error');
  } finally {
    if (formato === 'excel') {
      loadingExcel.value = false;
    } else if (formato === 'pdf') {
      loadingPdf.value = false;
    }
  }
};
</script>

<style scoped>
.reportes-view {
  max-width: 700px;
  margin: 0 auto;
  text-align: center;
}
.botones-reporte button {
  background-color: #28a745;
  color: white;
  padding: 12px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin: 10px;
  font-size: 16px;
}
.botones-reporte button:disabled {
  background-color: #aaa;
}
.botones-reporte button:hover:not(:disabled) {
  background-color: #218838;
}

.filtros-reporte {
  margin-top: 30px;
  padding: 15px;
  border: 1px solid #eee;
  border-radius: 5px;
  background-color: #f9f9f9;
}
.filtros-reporte label {
  margin-right: 10px;
}
.filtros-reporte input {
  margin-right: 20px;
  padding: 5px;
}

.mensaje {
  padding: 10px;
  border-radius: 4px;
  margin-top: 20px;
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