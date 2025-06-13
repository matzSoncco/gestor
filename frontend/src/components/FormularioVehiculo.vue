<template>
  <div class="formulario-container">
    <form @submit.prevent="onSubmit" class="formulario-registro">
      <h3 class="form-title">{{ isEdit ? 'Editar' : 'Nuevo' }} Vehículo</h3>

      <!-- Bloque 2 columnas -->
      <div class="form-grid">
        <div class="form-group">
          <label for="placa">Placa</label>
          <input id="placa" v-model="form.placa" required/>
        </div>
        <div class="form-group">
          <label for="anio">Año</label>
          <input id="anio" type="number" v-model.number="form.anio" required />
        </div>
        <div class="form-group">
          <label for="kilometraje">Kilometraje</label>
          <input id="kilometraje" type="number" v-model.number="form.kilometraje" step="0.1" required />
        </div>
        <div class="form-group">
          <label for="costo">Costo (S/)</label>
          <input id="costo" type="number" v-model.number="form.costo" step="0.01" required />
        </div>
        <div class="form-group">
          <label for="ubicacion">Ubicación</label>
          <input id="ubicacion" v-model="form.ubicacion" required />
        </div>
      </div>

      <h2>Datos de Tarjeta del Vehículo</h2>
      <div class="form-grid">
        <!-- Repite este patrón para cada campo -->
        <div class="form-group">
          <label for="categoria">Categoría</label>
          <input id="categoria" v-model="form.categoria" required />
        </div>
        <div class="form-group">
          <label for="marca">Marca</label>
          <input id="marca" v-model="form.marca" required />
        </div>
        <div class="form-group">
          <label for="modelo">Modelo</label>
          <input id="modelo" v-model="form.modelo" required />
        </div>
        <div class="form-group">
          <label for="version">Versión</label>
          <input id="version" v-model="form.version" required />
        </div>
        <div class="form-group">
          <label for="color">Color</label>
          <input id="color" v-model="form.color" required />
        </div>
        <div class="form-group">
          <label for="anio_fabricacion">Año de Fabricación</label>
          <input id="anio_fabricacion" type="number" v-model.number="form.anio_fabricacion" required />
        </div>
        <div class="form-group">
          <label for="anio_modelo">Año de Modelo</label>
          <input id="anio_modelo" type="number" v-model.number="form.anio_modelo" required />
        </div>
        <div class="form-group">
          <label for="motor">Motor</label>
          <input id="motor" v-model="form.motor" required />
        </div>
        <div class="form-group">
          <label for="combustible">Combustible</label>
          <select id="combustible" v-model="form.combustible" required>
            <option disabled value="">Seleccione</option>
            <option value="GASOLINA">Gasolina</option>
            <option value="DIÉSEL">Diésel</option>
            <option value="ELÉCTRICO">Eléctrico</option>
          </select>
        </div>
        <div class="form-group">
          <label for="forma_rodante">Forma Rodante</label>
          <input id="forma_rodante" v-model="form.forma_rodante" required />
        </div>
        <div class="form-group">
          <label for="vin">VIN</label>
          <input id="vin" v-model="form.vin" required />
        </div>
        <div class="form-group">
          <label for="serie_chasis">Serie de Chasis</label>
          <input id="serie_chasis" v-model="form.serie_chasis" required />
        </div>
        <div class="form-group">
          <label for="ejes">Ejes</label>
          <input id="ejes" type="number" v-model.number="form.ejes" required />
        </div>
        <div class="form-group">
          <label for="ruedas">Ruedas</label>
          <input id="ruedas" type="number" v-model.number="form.ruedas" required />
        </div>
        <div class="form-group">
          <label for="pasajeros">Pasajeros</label>
          <input id="pasajeros" type="number" v-model.number="form.pasajeros" required />
        </div>
        <div class="form-group">
          <label for="carroceria">Carrocería</label>
          <input id="carroceria" v-model="form.carroceria" required />
        </div>
        <div class="form-group">
          <label for="peso_neto">Peso Neto (kg)</label>
          <input id="peso_neto" type="number" v-model.number="form.peso_neto" step="0.001" required />
        </div>
        <div class="form-group">
          <label for="peso_bruto">Peso Bruto (kg)</label>
          <input id="peso_bruto" type="number" v-model.number="form.peso_bruto" step="0.001" required />
        </div>
        <div class="form-group">
          <label for="carga_util">Carga Útil (kg)</label>
          <input id="carga_util" type="number" v-model.number="form.carga_util" step="0.001" required />
        </div>
        <div class="form-group">
          <label for="cilindrada">Cilindrada (cc)</label>
          <input id="cilindrada" type="number" v-model.number="form.cilindrada" step="0.001" required />
        </div>
        <div class="form-group">
          <label for="cilindros">Cilindros</label>
          <input id="cilindros" type="number" v-model.number="form.cilindros" required />
        </div>
        <div class="form-group">
          <label for="altura">Altura (m)</label>
          <input id="altura" type="number" v-model.number="form.altura" step="0.001" required />
        </div>
        <div class="form-group">
          <label for="ancho">Ancho (m)</label>
          <input id="ancho" type="number" v-model.number="form.ancho" step="0.001" required />
        </div>
        <div class="form-group">
          <label for="longitud">Longitud (m)</label>
          <input id="longitud" type="number" v-model.number="form.longitud" step="0.001" required />
        </div>
      </div>

      <div class="form-actions">
        <button type="submit">{{ isEdit ? 'Actualizar' : 'Registrar' }}</button>
        <button type="submit">{{ isEdit ? 'Guardar' : 'Crear' }}</button>
        <button v-if="isEdit" type="button" @click="$emit('cancel')">Cancelar</button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { reactive, computed, watch } from 'vue';

const props = defineProps({
  modelValue: { type: Object, default: null }
});
const emits = defineEmits(['save','cancel']);

const form = reactive({
  placa: '',
  anio:  new Date().getFullYear(),
  kilometraje: 0,
  costo: 0,
  ubicacion: '',

  categoria: '',
  marca: '',
  modelo: '',
  version: '',
  color: '',
  anio_fabricacion: new Date().getFullYear(),
  anio_modelo:    new Date().getFullYear(),
  motor: '',
  combustible: '',
  forma_rodante: '',
  vin: '',
  serie_chasis: '',
  ejes: 0,
  ruedas: 0,
  pasajeros: 0,
  carroceria: '',
  peso_neto: 0,
  peso_bruto: 0,
  carga_util: 0,
  cilindrada: 0,
  cilindros: 0,
  altura: 0,
  ancho: 0,
  longitud: 0,
});

const isEdit = computed(() => !!props.modelValue);

watch(
  () => props.modelValue,
  val => {
    if (val) {
      Object.assign(form, { ...val });
    }
  },
  { immediate: true }
);

const onSubmit = () => {
  emits('save', { ...form });
};
</script>

<style scoped src="../assets/styles/FormularioOperacion.css"></style>