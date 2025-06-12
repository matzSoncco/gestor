<template>
  <form @submit.prevent="onSubmit" class="form-vehiculo">
    <h3>{{ isEdit ? 'Editar' : 'Nuevo' }} Vehículo</h3>

    <!-- Bloque 2 columnas -->
    <div class="grid-2">
      <div class="form-group">
        <label for="placa">Placa</label>
        <input id="placa" v-model="form.placa" required />
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

    <h4>Datos de Tarjeta del Vehículo</h4>
    <div class="grid-3">
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
      <!-- … sigue con version, color, anio_fabricacion, anio_modelo, motor … -->
      <div class="form-group">
        <label for="combustible">Combustible</label>
        <select id="combustible" v-model="form.combustible" required>
          <option disabled value="">Seleccione</option>
          <option value="GASOLINA">Gasolina</option>
          <option value="DIÉSEL">Diésel</option>
          <option value="ELÉCTRICO">Eléctrico</option>
        </select>
      </div>
      <!-- … resto de campos: forma_rodante, vin, serie_chasis, ejes, ruedas, pasajeros … -->
      <div class="form-group">
        <label for="peso_neto">Peso Neto (kg)</label>
        <input id="peso_neto" type="number" v-model.number="form.peso_neto" step="0.001" required />
      </div>
      <!-- … peso_bruto, carga_util, cilindrada, cilindros, altura, ancho, longitud … -->
    </div>

    <button type="submit">{{ isEdit ? 'Guardar' : 'Crear' }}</button>
    <button v-if="isEdit" type="button" @click="$emit('cancel')">Cancelar</button>
  </form>
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

<style scoped>
.form-vehiculo { margin-bottom: 2rem; }
.grid-2 { display: grid; grid-template-columns: repeat(2,1fr); gap: 1rem; }
.grid-3 { display: grid; grid-template-columns: repeat(3,1fr); gap: 1rem; margin-bottom: 1.5rem; }
.form-group { display: flex; flex-direction: column; }
label { font-weight: 600; margin-bottom: .25rem; }
input, select { padding: .5rem; }
button { margin-top: 1rem; margin-right: .5rem; }
</style>