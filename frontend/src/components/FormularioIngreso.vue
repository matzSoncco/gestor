<template>
  <form @submit.prevent="enviarFormulario" class="formulario-ingreso">
    <div class="form-group">
      <label for="nombre">Nombre:</label>
      <input type="text" id="nombre" v-model="formData.nombre" required />
    </div>

    <div class="form-group">
      <label for="descripcion">Descripción:</label>
      <textarea id="descripcion" v-model="formData.descripcion"></textarea>
    </div>

    <div class="form-group">
      <label for="cantidad">Cantidad:</label>
      <input type="number" id="cantidad" v-model.number="formData.cantidad" required min="0" />
    </div>

    <div class="form-group">
      <label for="fecha">Fecha:</label>
      <input type="date" id="fecha" v-model="formData.fecha" />
    </div>

    <div v-if="mensaje" :class="['mensaje', tipoMensaje]">
      {{ mensaje }}
    </div>

    <button type="submit" :disabled="loading">
      {{ loading ? 'Enviando...' : 'Enviar Datos' }}
    </button>
  </form>
</template>

<script setup>
import { ref, reactive } from 'vue';
import apiService from '../services/apiService';

const emit = defineEmits(['datos-enviados']);

const formData = reactive({
  nombre: '',
  descripcion: '',
  cantidad: null,
  fecha: '',
});

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

const resetForm = () => {
  formData.nombre = '';
  formData.descripcion = '';
  formData.cantidad = null;
  formData.fecha = '';
};

const enviarFormulario = async () => {
  loading.value = true;
  try {
    const response = await apiService.submitFormData(formData);
    // Asumimos que el backend responde con un mensaje o estado
    mostrarMensajeLocal('Datos enviados correctamente.', 'success');
    emit('datos-enviados', { success: true, message: 'Datos del formulario enviados con éxito.', data: response.data });
    resetForm();
  } catch (error) {
    console.error('Error al enviar formulario:', error);
    const errorMsg = error.response?.data?.detail || error.message || 'Error desconocido al enviar los datos.';
    mostrarMensajeLocal(`Error: ${errorMsg}`, 'error');
    emit('datos-enviados', { success: false, message: `Error al enviar datos: ${errorMsg}` });
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.formulario-ingreso {
  display: flex;
  flex-direction: column;
  gap: 15px; /* Espacio entre grupos de formulario */
}
.form-group {
  display: flex;
  flex-direction: column;
}
.form-group label {
  margin-bottom: 5px;
  font-weight: bold;
}
.form-group input,
.form-group textarea {
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 16px;
}
.form-group textarea {
  min-height: 80px;
  resize: vertical;
}
button {
  background-color: #007bff;
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
  background-color: #0056b3;
}
.mensaje {
  padding: 10px;
  border-radius: 4px;
  margin-top: 5px; /* Ajustado para estar más cerca del botón si aparece */
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