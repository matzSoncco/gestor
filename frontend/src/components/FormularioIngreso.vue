<template>
  <div class="formulario-container">
    <form @submit.prevent="enviarFormulario" class="formulario-registro">
      <h2 class="form-title">Registro de Documento</h2>
      
      <!-- Campos comunes -->
      <div class="form-section">
        <div class="form-group">
          <label for="numeroDocumento">N° de Factura o Documento:</label>
          <input 
            type="number" 
            id="numeroDocumento" 
            v-model="formData.numeroDocumento"
            placeholder="Ingrese número de documento"
            required
          />
        </div>

        <div class="form-group">
          <label for="rucProveedor">RUC del Proveedor:</label>
          <input 
            type="number" 
            id="rucProveedor" 
            v-model="formData.rucProveedor"
            placeholder="Ingrese RUC"
            required
          />
        </div>

        <div class="form-group">
          <label for="tipoOperacion">Tipo de Operación:</label>
          <select 
            id="tipoOperacion" 
            v-model="formData.tipoOperacion"
            required
            class="select-custom"
          >
            <option value="" disabled>Seleccione un tipo</option>
            <option value="combustible">Combustible</option>
            <option value="mantenimiento">Mantenimiento</option>
            <option value="servicio">Servicio</option>
          </select>
        </div>

        <div class="form-group">
          <label for="fecha">Fecha:</label>
          <input type="date" id="fecha" v-model="formData.fecha" required />
        </div>
      </div>
      
      <!-- Campos específicos según tipo de documento -->
      <transition name="fade">
        <div class="form-section specific-fields" v-if="formData.tipoOperacion">
          <!-- Campos para Combustible -->
          <template v-if="formData.tipoOperacion === 'combustible'">
            <h3 class="section-title">Detalles de Combustible</h3>
            
            <div class="form-grid">
              <div class="form-group">
                <label for="cantidadGalones">Cantidad de Galones:</label>
                <input 
                  type="number" 
                  id="cantidadGalones" 
                  v-model="formData.cantidadGalones"
                  @input="calcularCostoTotal"
                  placeholder="Cantidad"
                  min="0" 
                  step="0.01"
                  required 
                />
              </div>

              <div class="form-group">
                <label for="costoPorGalon">Costo por Galón (S/):</label>
                <input 
                  type="number" 
                  id="costoPorGalon" 
                  v-model="formData.costoPorGalon"
                  @input="calcularCostoTotal"
                  placeholder="Precio unitario" 
                  min="0" 
                  step="0.01"
                  required 
                />
              </div>

              <div class="form-group">
                <label for="costoTotal">Costo Total (S/):</label>
                <input 
                  type="number" 
                  id="costoTotal" 
                  v-model="formData.costoTotal"
                  placeholder="Total"
                  min="0" 
                  step="0.01"
                  readonly
                />
              </div>

              <div class="form-group">
                <label for="ubicacion">Ubicación:</label>
                <input 
                  type="text" 
                  id="ubicacion" 
                  v-model="formData.ubicacion"
                  placeholder="Ubicación"
                  required 
                />
              </div>
            </div>
          </template>

          <!-- Campos para Mantenimiento -->
          <template v-if="formData.tipoOperacion === 'mantenimiento'">
            <h3 class="section-title">Detalles de Mantenimiento</h3>
            
            <div class="form-grid">
              <div class="form-group">
                <label for="costoTotalMantenimiento">Costo Total (S/):</label>
                <input 
                  type="number" 
                  id="costoTotalMantenimiento" 
                  v-model="formData.costoTotalMantenimiento"
                  placeholder="Costo total"
                  min="0" 
                  step="0.01"
                  required 
                />
              </div>

              <div class="form-group">
                <label for="itemsCambiados">Items que se Cambiaron:</label>
                <input 
                  type="text" 
                  id="itemsCambiados" 
                  v-model="formData.itemsCambiados"
                  placeholder="Items cambiados"
                  required 
                />
              </div>

              <div class="form-group">
                <label for="tipoRepuesto">Tipo de Repuesto:</label>
                <input 
                  type="text" 
                  id="tipoRepuesto" 
                  v-model="formData.tipoRepuesto"
                  placeholder="Tipo de repuesto"
                  required 
                />
              </div>

              <div class="form-group">
                <label for="cantidad">Cantidad:</label>
                <input 
                  type="number" 
                  id="cantidad" 
                  v-model="formData.cantidad"
                  placeholder="Cantidad"
                  min="1" 
                  required 
                />
              </div>
            </div>
          </template>

          <!-- Campos para Servicio -->
          <template v-if="formData.tipoOperacion === 'servicio'">
            <h3 class="section-title">Detalles del Servicio</h3>
            
            <div class="form-group">
              <label for="tipoServicio">Tipo de Servicio:</label>
              <input 
                type="text" 
                id="tipoServicio" 
                v-model="formData.tipoServicio"
                placeholder="Especifique el tipo de servicio"
                required 
              />
            </div>
          </template>

          <!-- Campo de descripción (común para todos) -->
          <div class="form-group descripcion-group">
            <label for="descripcion">Descripción (Opcional):</label>
            <textarea 
              id="descripcion" 
              v-model="formData.descripcion"
              placeholder="Agregue información adicional aquí..."
              rows="3"
            ></textarea>
          </div>
        </div>
      </transition>

      <!-- Mensajes y botón de envío -->
      <div v-if="mensaje" :class="['mensaje', tipoMensaje]">
        {{ mensaje }}
      </div>

      <div class="form-actions">
        <button type="submit" :disabled="loading" class="btn-submit">
          {{ loading ? 'Enviando...' : 'Registrar Documento' }}
        </button>
        <button type="button" @click="resetForm" class="btn-reset" :disabled="loading">
          Limpiar Formulario
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, reactive, watch } from 'vue';
// Importamos el servicio API (manteniéndolo de tu código original)
import apiService from '../services/apiService';

// Emitimos eventos al componente padre
const emit = defineEmits(['datos-enviados']);

// Estado reactivo del formulario
const formData = reactive({
  numeroDocumento: '',
  rucProveedor: '',
  tipoOperacion: '',
  fecha: '',
  // Campos para combustible
  cantidadGalones: '',
  costoPorGalon: '',
  costoTotal: '',
  ubicacion: '',
  // Campos para mantenimiento
  costoTotalMantenimiento: '',
  itemsCambiados: '',
  tipoRepuesto: '',
  cantidad: '',
  // Campos para servicio
  tipoServicio: '',
  // Común para todos
  descripcion: ''
});

const loading = ref(false);
const mensaje = ref('');
const tipoMensaje = ref('');

// Función para calcular el costo total para combustible
const calcularCostoTotal = () => {
  if (formData.cantidadGalones && formData.costoPorGalon) {
    const total = parseFloat(formData.cantidadGalones) * parseFloat(formData.costoPorGalon);
    formData.costoTotal = isNaN(total) ? '' : total.toFixed(2);
  } else {
    formData.costoTotal = '';
  }
};

// Vigilamos cambios en los campos para actualizar automáticamente
watch([() => formData.cantidadGalones, () => formData.costoPorGalon], () => {
  if (formData.tipoOperacion === 'combustible') {
    calcularCostoTotal();
  }
});

// Función para mostrar mensajes temporales
const mostrarMensajeLocal = (msg, tipo = 'success', duracion = 3000) => {
  mensaje.value = msg;
  tipoMensaje.value = tipo;
  setTimeout(() => {
    mensaje.value = '';
    tipoMensaje.value = '';
  }, duracion);
};

// Función para resetear el formulario
const resetForm = () => {
  Object.keys(formData).forEach(key => {
    formData[key] = '';
  });
};

// Función para enviar el formulario
const enviarFormulario = async () => {
  loading.value = true;
  try {
    // Usamos la misma lógica que el formulario original
    const response = await apiService.submitFormData(formData);
    
    mostrarMensajeLocal('Documento registrado correctamente.', 'success');
    emit('datos-enviados', { 
      success: true, 
      message: 'Datos del documento enviados con éxito.', 
      data: response.data 
    });
    resetForm();
  } catch (error) {
    console.error('Error al enviar formulario:', error);
    const errorMsg = error.response?.data?.detail || error.message || 'Error desconocido al enviar los datos.';
    mostrarMensajeLocal(`Error: ${errorMsg}`, 'error');
    emit('datos-enviados', { 
      success: false, 
      message: `Error al enviar datos: ${errorMsg}` 
    });
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.formulario-container {
  max-width: 850px;
  margin: 0 auto;
  padding: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  border-radius: 12px;
  background-color: #fff;
}

.form-title {
  text-align: center;
  margin-bottom: 25px;
  color: #2c3e50;
  font-size: 1.8rem;
  padding-bottom: 10px;
  border-bottom: 2px solid #3498db;
}

.section-title {
  color: #3498db;
  margin: 5px 0 15px;
  font-size: 1.3rem;
  border-left: 4px solid #3498db;
  padding-left: 10px;
}

.form-section {
  margin-bottom: 20px;
  padding: 20px;
  background-color: #f8f9fa;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
}

.specific-fields {
  background-color: #f1f8ff;
  border-left: 3px solid #3498db;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
}

.form-group {
  margin-bottom: 15px;
  display: flex;
  flex-direction: column;
}

.descripcion-group {
  grid-column: 1 / -1;
  margin-top: 10px;
}

label {
  font-weight: 600;
  margin-bottom: 8px;
  color: #34495e;
  font-size: 1rem;
}

input, select, textarea {
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 16px;
  transition: border-color 0.3s, box-shadow 0.3s;
  background-color: #fff;
}

input:focus, select:focus, textarea:focus {
  border-color: #3498db;
  box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.2);
  outline: none;
}

input[readonly] {
  background-color: #f5f5f5;
  border: 1px dashed #aaa;
  font-weight: bold;
  color: #2c3e50;
}

.select-custom {
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%233498db' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 12px center;
  background-size: 16px;
  padding-right: 40px;
}

textarea {
  resize: vertical;
  min-height: 80px;
}

.form-actions {
  display: flex;
  gap: 15px;
  margin-top: 20px;
  justify-content: center;
}

button {
  padding: 12px 20px;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 180px;
}

.btn-submit {
  background-color: #3498db;
  color: white;
}

.btn-submit:hover:not(:disabled) {
  background-color: #2980b9;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.btn-reset {
  background-color: #f8f9fa;
  color: #34495e;
  border: 1px solid #ddd;
}

.btn-reset:hover:not(:disabled) {
  background-color: #ecf0f1;
}

button:disabled {
  background-color: #bdc3c7;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.mensaje {
  width: 100%;
  padding: 12px;
  border-radius: 8px;
  margin: 15px 0;
  text-align: center;
  font-weight: 500;
  animation: fadeIn 0.3s;
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

/* Animaciones para transiciones */
.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Responsive media queries */
@media (max-width: 768px) {
  .form-grid {
    grid-template-columns: 1fr;
  }
  
  .form-actions {
    flex-direction: column;
  }
  
  button {
    width: 100%;
  }
}
</style>