<template>
  <div class="formulario-container">
    <ModalGlobal
    :show="mensajeGlobal !== ''"
    :mensaje="mensajeGlobal"
    :tipo="tipoMensajeGlobal"
    @close="mensajeGlobal = ''"
    />
    <form @submit.prevent="submitForm" class="formulario-registro">
      <!-- Bloque 2 columnas -->
      <div class="form-grid">
        <div class="form-group">
          <label for="placa">Placa</label>
          <input
            type="text"
            id="placa"
            v-model="formData.placa"
            placeholder="Ingrese la placa del vehículo"
            minlength="6"
            maxlength="6"
            pattern="[A-Z0-9]{6}"
            required
            @input="formData.placa = formData.placa.toUpperCase().replace(/[^A-Z0-9]/g, '')"
          />
        </div>
        <div class="form-group">
          <label for="anio">Año</label>
          <input
            id="anio"
            type="number"
            v-model.number="formData.anio"
            min="1900"
            max="2100"
            placeholder="Ingrese el año de matriculación"
            required
          />
        </div>
        <div class="form-group">
          <label for="kilometraje">Kilometraje</label>
          <input
            id="kilometraje"
            type="number"
            v-model.number="formData.kilometraje"
            min="0"
            step="0.1"
            placeholder="Ingrese el kilometraje inicial"
            required
          />
        </div>
        <div class="form-group">
          <label for="costo">Costo (S/)</label>
          <input
            id="costo"
            type="number"
            v-model.number="formData.costo"
            min="0"
            step="0.01"
            placeholder="Ingrese el costo del vehiculo"
            required
          />
        </div>
        <div class="form-group">
          <label for="ubicacion">Ubicación</label>
          <input
            id="ubicacion"
            v-model="formData.ubicacion"
            placeholder="Ingrese la ubicación de adquisición"
            required
          />
        </div>
      </div>

      <h2>Datos de Tarjeta del Vehículo</h2>
      <div class="form-grid">
        <!-- Repite este patrón para cada campo -->
        <div class="form-group">
          <label for="categoria">Categoría</label>
          <input id="categoria" v-model="formData.categoria" placeholder="Ingrese la categoría" required />
        </div>
        <div class="form-group">
          <label for="marca">Marca</label>
          <input id="marca" v-model="formData.marca" placeholder="Ingrese la marca" required />
        </div>
        <div class="form-group">
          <label for="modelo">Modelo</label>
          <input id="modelo" v-model="formData.modelo" placeholder="Ingrese el modelo" required />
        </div>
        <div class="form-group">
          <label for="version">Versión</label>
          <input id="version" v-model="formData.version" placeholder="Ingrese la version" required />
        </div>
        <div class="form-group">
          <label for="color">Color</label>
          <input id="color" v-model="formData.color" placeholder="Ingrese el color" required />
        </div>
        <div class="form-group">
          <label for="anio_fabricacion">Año de Fabricación</label>
          <input
            id="anio_fabricacion"
            type="number"
            v-model.number="formData.anio_fabricacion"
            placeholder="Ingrese el año de fabricación"
            min="1900"
            max="2100"
            required
          />
        </div>
        <div class="form-group">
          <label for="anio_modelo">Año de Modelo</label>
          <input
            id="anio_modelo"
            type="number"
            v-model.number="formData.anio_modelo"
            placeholder="Ingrese el año de modelo"
            min="1900"
            max="2100"
            required
          />
        </div>
        <div class="form-group">
          <label for="motor">Motor</label>
          <input id="motor" v-model="formData.motor" placeholder="Ingrese el tipo de motor" required />
        </div>
        <div class="form-group">
          <label for="combustible">Combustible</label>
          <select id="combustible" v-model="formData.combustible" required>
            <option disabled value="">Seleccione</option>
            <option value="GASOLINA">Gasolina</option>
            <option value="DIÉSEL">Diésel</option>
            <option value="ELÉCTRICO">Eléctrico</option>
          </select>
        </div>
        <div class="form-group">
          <label for="forma_rodante">Forma Rodante</label>
          <input id="forma_rodante" v-model="formData.forma_rodante" placeholder="Ingrese la forma rodante" required />
        </div>
        <div class="form-group">
          <label for="vin">VIN</label>
          <input
            id="vin"
            v-model="formData.vin"
            placeholder="Ingrese el VIN del vehiculo"
            minlength="17"
            maxlength="17"
            pattern="[A-HJ-NPR-Z0-9]{17}"
            title="17 caracteres alfanuméricos en mayúscula, sin I, O, Q."
            @input="formData.vin = formData.vin.toUpperCase().replace(/[^A-HJ-NPR-Z0-9]/g, '')"
            required
          />
          <small>17 caracteres sin I, O, Q</small>
        </div>
        <div class="form-group">
          <label for="serie_chasis">Serie de Chasis</label>
          <input id="serie_chasis" v-model="formData.serie_chasis" placeholder="Ingrese la serie de chasis" required />
        </div>
        <div class="form-group">
          <label for="ejes">Ejes</label>
          <input id="ejes" type="number" v-model.number="formData.ejes" placeholder="Ingrese la cantidad de ejes" required />
        </div>
        <div class="form-group">
          <label for="ruedas">Ruedas</label>
          <input id="ruedas" type="number" v-model.number="formData.ruedas" placeholder="Ingrese la cantidad de ruedas" required />
        </div>
        <div class="form-group">
          <label for="pasajeros">Pasajeros</label>
          <input id="pasajeros" type="number" v-model.number="formData.pasajeros" placeholder="Ingrese la cantidad de pasajeros" required />
        </div>
        <div class="form-group">
          <label for="carroceria">Carrocería</label>
          <input id="carroceria" v-model="formData.carroceria" placeholder="Ingrese la carrocería" required />
        </div>
        <div class="form-group">
          <label for="peso_neto">Peso Neto (kg)</label>
          <input id="peso_neto" type="number" v-model.number="formData.peso_neto" placeholder="Ingrese el peso neto" step="0.001" required />
        </div>
        <div class="form-group">
          <label for="peso_bruto">Peso Bruto (kg)</label>
          <input id="peso_bruto" type="number" v-model.number="formData.peso_bruto" placeholder="Ingrese el peso bruto" step="0.001" required />
        </div>
        <div class="form-group">
          <label for="carga_util">Carga Útil (kg)</label>
          <input id="carga_util" type="number" v-model.number="formData.carga_util" placeholder="Ingrese la carga útil" step="0.001" required />
        </div>
        <div class="form-group">
          <label for="cilindrada">Cilindrada (cc)</label>
          <input id="cilindrada" type="number" v-model.number="formData.cilindrada" placeholder="Ingrese la cilindrada" step="0.001" required />
        </div>
        <div class="form-group">
          <label for="cilindros">Cilindros</label>
          <input id="cilindros" type="number" v-model.number="formData.cilindros" placeholder="Ingrese la cantidad de cilindros" required />
        </div>
        <div class="form-group">
          <label for="altura">Altura (m)</label>
          <input id="altura" type="number" v-model.number="formData.altura" placeholder="Ingrese la altura" step="0.001" required />
        </div>
        <div class="form-group">
          <label for="ancho">Ancho (m)</label>
          <input id="ancho" type="number" v-model.number="formData.ancho" placeholder="Ingrese el ancho" step="0.001" required />
        </div>
        <div class="form-group">
          <label for="longitud">Longitud (m)</label>
          <input id="longitud" type="number" v-model.number="formData.longitud" placeholder="Ingrese la longitud" step="0.001" required />
        </div>
      </div>

      <div class="form-actions">
        <button
          type="submit"
          :disabled="loading"
          class="btn-submit"
        >
          {{ loading ? 'Enviando...' : 'Registrar Vehículo' }}
        </button>
        <button
          type="button"
          @click="resetForm"
          :disabled="loading"
          class="btn-reset"
        >
          Limpiar Formulario
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { useVehiculos } from '../../composables/vehiculos/useVehiculo';
import ModalGlobal from '../../components/modals/ModalGlobal.vue'
import useMensajeGlobal from '../../composables/global/useMensajeGlobal';

const { mensajeGlobal, tipoMensajeGlobal } = useMensajeGlobal();
const {
  formData,
  loading,
  resetForm,
  submitForm
} = useVehiculos();
</script>

<style scoped src="../../assets/styles/FormularioOperacion.css"></style>