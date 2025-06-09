<template>
  <div class="formulario-container">
    <form @submit.prevent="enviarFormulario" class="formulario-registro">
      <h2 class="form-title">Registro de Vehículo</h2>

      <!-- Información del Vehículo -->
      <div class="form-grid">
        <div class="form-group">
          <label for="placa">Placa:</label>
          <input type="text" id="placa" v-model="formData.placa" placeholder="Ingrese placa del vehículo" required maxlength="6" />
        </div>
        <div class="form-group">
          <label for="anio">Año:</label>
          <input type="number" id="anio" v-model.number="formData.anio" placeholder="Año del vehículo" required />
        </div>
      </div>

      <div class="form-grid">
        <div class="form-group">
          <label for="kilometraje">Kilometraje Inicial:</label>
          <input type="number" id="kilometraje" v-model.number="formData.kilometraje" placeholder="Km actuales" required step="0.01" />
        </div>
        <div class="form-group">
          <label for="costo">Costo de Adquisición (S/):</label>
          <input type="number" id="costo" v-model.number="formData.costo" placeholder="Costo del vehículo" required step="0.01" />
        </div>
      </div>

      <div class="form-grid">
        <div class="form-group">
          <label for="ubicacion">Ubicación:</label>
          <input type="text" id="ubicacion" v-model="formData.ubicacion" placeholder="Ubicación actual del vehículo" required />
        </div>
      </div>

      <!-- Información de Tarjeta de Vehículo -->
      <h3 class="section-title">Datos de Tarjeta de Propiedad</h3>

      <div class="form-grid">
        <div class="form-group">
          <label for="categoria">Categoría:</label>
          <input type="text" id="categoria" v-model="formData.tarjetaVehiculo.categoria" placeholder="Categoría del vehículo" required maxlength="10" />
        </div>
        <div class="form-group">
          <label for="marca">Marca:</label>
          <input type="text" id="marca" v-model="formData.tarjetaVehiculo.marca" placeholder="Marca del vehículo" required maxlength="20" />
        </div>
      </div>

      <div class="form-grid">
        <div class="form-group">
          <label for="modelo">Modelo:</label>
          <input type="text" id="modelo" v-model="formData.tarjetaVehiculo.modelo" placeholder="Modelo del vehículo" required maxlength="20" />
        </div>
        <div class="form-group">
          <label for="version">Versión:</label>
          <input type="text" id="version" v-model="formData.tarjetaVehiculo.version" placeholder="Versión del vehículo" required maxlength="100" />
        </div>
      </div>

      <div class="form-grid">
        <div class="form-group">
          <label for="color">Color:</label>
          <input type="text" id="color" v-model="formData.tarjetaVehiculo.color" placeholder="Color del vehículo" required maxlength="30" />
        </div>
        <div class="form-group">
          <label for="combustible">Tipo de Combustible:</label>
          <select id="combustible" v-model="formData.tarjetaVehiculo.combustible" required class="select-custom">
            <option value="" disabled>Seleccione un tipo</option>
            <option v-for="(tipo, index) in tiposCombustible" :key="index" :value="tipo">{{ tipo }}</option>
          </select>
        </div>
      </div>

      <div class="form-grid">
        <div class="form-group">
          <label for="anio_fabricacion">Año de Fabricación:</label>
          <input type="number" id="anio_fabricacion" v-model.number="formData.tarjetaVehiculo.anio_fabricacion" placeholder="Año de fabricación" required />
        </div>
        <div class="form-group">
          <label for="anio_modelo">Año del Modelo:</label>
          <input type="number" id="anio_modelo" v-model.number="formData.tarjetaVehiculo.anio_modelo" placeholder="Año del modelo" required />
        </div>
      </div>

      <div class="form-grid">
        <div class="form-group">
          <label for="motor">Motor:</label>
          <input type="text" id="motor" v-model="formData.tarjetaVehiculo.motor" placeholder="Número de motor" required maxlength="20" />
        </div>
        <div class="form-group">
          <label for="forma_rodante">Forma Rodante:</label>
          <input type="text" id="forma_rodante" v-model="formData.tarjetaVehiculo.forma_rodante" placeholder="Forma rodante" required maxlength="10" />
        </div>
      </div>

      <div class="form-grid">
        <div class="form-group">
          <label for="vin">VIN:</label>
          <input type="text" id="vin" v-model="formData.tarjetaVehiculo.vin" placeholder="Número de identificación del vehículo" required maxlength="30" />
        </div>
        <div class="form-group">
          <label for="serie_chasis">Serie/Chasis:</label>
          <input type="text" id="serie_chasis" v-model="formData.tarjetaVehiculo.serie_chasis" placeholder="Serie o número de chasis" required maxlength="30" />
        </div>
      </div>

      <div class="form-grid">
        <div class="form-group">
          <label for="ejes">Número de Ejes:</label>
          <input type="number" id="ejes" v-model.number="formData.tarjetaVehiculo.ejes" placeholder="Cantidad de ejes" required />
        </div>
        <div class="form-group">
          <label for="ruedas">Número de Ruedas:</label>
          <input type="number" id="ruedas" v-model.number="formData.tarjetaVehiculo.ruedas" placeholder="Cantidad de ruedas" required />
        </div>
      </div>

      <div class="form-grid">
        <div class="form-group">
          <label for="pasajeros">Número de Pasajeros:</label>
          <input type="number" id="pasajeros" v-model.number="formData.tarjetaVehiculo.pasajeros" placeholder="Capacidad de pasajeros" required />
        </div>
        <div class="form-group">
          <label for="carroceria">Carrocería:</label>
          <input type="text" id="carroceria" v-model="formData.tarjetaVehiculo.carroceria" placeholder="Tipo de carrocería" required maxlength="20" />
        </div>
      </div>

      <div class="form-grid">
        <div class="form-group">
          <label for="peso_neto">Peso Neto (ton):</label>
          <input type="number" id="peso_neto" v-model.number="formData.tarjetaVehiculo.peso_neto" placeholder="Peso neto en toneladas" required step="0.001" />
        </div>
        <div class="form-group">
          <label for="peso_bruto">Peso Bruto (ton):</label>
          <input type="number" id="peso_bruto" v-model.number="formData.tarjetaVehiculo.peso_bruto" placeholder="Peso bruto en toneladas" required step="0.001" />
        </div>
      </div>

      <div class="form-grid">
        <div class="form-group">
          <label for="carga_util">Carga Útil (ton):</label>
          <input type="number" id="carga_util" v-model.number="formData.tarjetaVehiculo.carga_util" placeholder="Carga útil en toneladas" required step="0.001" />
        </div>
        <div class="form-group">
          <label for="cilindrada">Cilindrada (cc):</label>
          <input type="number" id="cilindrada" v-model.number="formData.tarjetaVehiculo.cilindrada" placeholder="Cilindrada en cc" required />
        </div>
      </div>

      <div class="form-grid">
        <div class="form-group">
          <label for="cilindros">Número de Cilindros:</label>
          <input type="number" id="cilindros" v-model.number="formData.tarjetaVehiculo.cilindros" placeholder="Cantidad de cilindros" required />
        </div>
      </div>

      <h3 class="section-title">Dimensiones</h3>
      <div class="form-grid">
        <div class="form-group">
          <label for="altura">Altura (m):</label>
          <input type="number" id="altura" v-model.number="formData.tarjetaVehiculo.altura" placeholder="Altura en metros" required step="0.01" />
        </div>
        <div class="form-group">
          <label for="ancho">Ancho (m):</label>
          <input type="number" id="ancho" v-model.number="formData.tarjetaVehiculo.ancho" placeholder="Ancho en metros" required step="0.01" />
        </div>
      </div>

      <div class="form-grid">
        <div class="form-group">
          <label for="longitud">Longitud (m):</label>
          <input type="number" id="longitud" v-model.number="formData.tarjetaVehiculo.longitud" placeholder="Longitud en metros" required step="0.001" />
        </div>
      </div>

      <div v-if="mensaje" :class="['mensaje', tipoMensaje]">
        {{ mensaje }}
      </div>

      <div class="form-actions">
        <button type="submit" :disabled="loading" class="btn-submit">
          {{ loading ? 'Enviando...' : 'Registrar Vehículo' }}
        </button>
        <button type="button" @click="resetForm" class="btn-reset" :disabled="loading">
          Limpiar Formulario
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import useFormularioVehiculos from '../composables/useVehiculo';

// Definir emisión de eventos
const emit = defineEmits(['datos-enviados']);

// Usar el composable
const { 
  formData, 
  loading, 
  mensaje, 
  tipoMensaje, 
  enviarFormulario, 
  resetForm, 
  calcularCargaUtil 
} = useFormularioVehiculos();

// Método para manejar el envío del formulario
const submitForm = async () => {
  try {
    const resultado = await enviarFormulario();
    
    // Si el formulario se procesó correctamente, emitir los datos
    if (resultado) {
      emit('datos-enviados', resultado);
    }
  } catch (error) {
    console.error('Error al enviar formulario:', error);
  }
};
</script>

<style scoped src="../assets/styles/FormularioOperacion.css"></style>