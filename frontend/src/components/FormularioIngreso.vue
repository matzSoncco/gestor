<template>
  <div class="formulario-container">
    <form @submit.prevent="enviarFormulario" class="formulario-registro">
      <h2 class="form-title">Registro de Operacion</h2>

      <div class="form-grid">
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
      </div>

      <div class="form-grid">
        <div class="form-group">
          <label for="nombreProveedor">Nombre del Proveedor</label>
          <input
            type="text"
            id="nombreProveedor"
            v-model="formData.nombreProveedor"
            placeholder="Aquí se mostrará el nombre del proveedor"
            
          />
        </div>
      </div>

      <div class="form-grid">
        <div class="form-group">
          <label for="tipoOperacion">Tipo de Operacion:</label>
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

      <transition name="fade">
        <div class="form-section specific-fields" v-if="formData.tipoOperacion">

          <!-- Combustible -->
          <template v-if="formData.tipoOperacion === 'combustible'">
            <h3 class="section-title">Detalles de Combustible</h3>
            <div
              v-for="(comb, index) in formData.combustibles"
              :key="comb.id"
              class="dynamic-row"
            >
              <div class="form-group">
                <label :for="'cantidadGalones-' + comb.id">Cant. Galones:</label>
                <input
                  type="number"
                  :id="'cantidadGalones-' + comb.id"
                  v-model.number="comb.cantidadGalones"
                  placeholder="Galones"
                  min="0"
                  step="0.01"
                  required
                />
              </div>
              <div class="form-group">
                <label :for="'costoPorGalon-' + comb.id">Costo/Galón:</label>
                <input
                  type="number"
                  :id="'costoPorGalon-' + comb.id"
                  v-model.number="comb.costoPorGalon"
                  placeholder="S/ por Galón"
                  min="0"
                  step="0.01"
                  required
                />
              </div>
              <div class="form-group">
                <label :for="'subtotalCombustible-' + comb.id">Subtotal:</label>
                <input
                  type="number"
                  :id="'subtotalCombustible-' + comb.id"
                  v-model="comb.subtotal"
                  readonly
                  class="readonly-input"
                />
              </div>
              <div class="form-group">
                <label :for="'placaVehiculo-' + comb.id">Placa/Vehículo:</label>
                <input
                  type="text"
                  :id="'placaVehiculo-' + comb.id"
                  v-model="comb.placaVehiculo"
                  placeholder="Placa o tipo"
                  required
                />
              </div>
              <button
                type="button"
                @click="removeCombustibleRow(comb.id)"
                class="btn-remove-row"
                title="Eliminar fila"
              >&times;</button>
            </div>
            <button
              type="button"
              @click="addCombustibleRow"
              class="btn-add-row"
            >
              <span class="plus-icon">+</span> Agregar Fila de Combustible
            </button>
            <div class="total-summary">
              <strong>
                Costo Total Combustible (S/):
                {{ costoTotalCombustible.toFixed(2) }}
              </strong>
            </div>
          </template>

          <!-- Mantenimiento -->
          <template v-if="formData.tipoOperacion === 'mantenimiento'">
            <h3 class="section-title">Detalles de Mantenimiento</h3>
            <div
              v-for="(mant, index) in formData.mantenimientos"
              :key="mant.id"
              class="dynamic-row maintenance-row"
            >
              <div class="form-group item-description-group">
                <label :for="'descripcionItem-' + mant.id">
                  Item Cambiado/Servicio:
                </label>
                <input
                  type="text"
                  :id="'descripcionItem-' + mant.id"
                  v-model="mant.descripcionItem"
                  placeholder="Escriba o seleccione item"
                  @input="updateSugerencias($event.target.value, index)"
                  @focus="updateSugerencias($event.target.value, index)"
                  @blur="blurHandler(index)"
                  autocomplete="off"
                  required
                />
                <ul
                  v-if="sugerencias.length > 0 && inputActivo === index"
                  class="autocomplete-suggestions"
                >
                  <li
                    v-for="suggestion in sugerencias"
                    :key="suggestion"
                    @mousedown.prevent="selectItem(suggestion, index)"
                  >
                    {{ suggestion }}
                  </li>
                </ul>
              </div>
              <div class="form-group">
                <label :for="'cantidadMantenimiento-' + mant.id">Cantidad:</label>
                <input
                  type="number"
                  :id="'cantidadMantenimiento-' + mant.id"
                  v-model.number="mant.cantidad"
                  placeholder="Cant."
                  min="1"
                  required
                />
              </div>
              <div class="form-group">
                <label :for="'costoUnitarioMantenimiento-' + mant.id">
                  Costo Unit. (S/):
                </label>
                <input
                  type="number"
                  :id="'costoUnitarioMantenimiento-' + mant.id"
                  v-model.number="mant.costoUnitario"
                  placeholder="S/ Unitario"
                  min="0"
                  step="0.01"
                  required
                />
              </div>
              <div class="form-group">
                <label :for="'subtotalMantenimiento-' + mant.id">
                  Subtotal (S/):
                </label>
                <input
                  type="number"
                  :id="'subtotalMantenimiento-' + mant.id"
                  v-model="mant.subtotalItem"
                  readonly
                  class="readonly-input"
                />
              </div>
              <button
                type="button"
                @click="removeMantenimientoRow(mant.id)"
                class="btn-remove-row"
                title="Eliminar fila"
              >&times;</button>
            </div>
            <button
              type="button"
              @click="addMantenimientoRow"
              class="btn-add-row"
            >
              <span class="plus-icon">+</span> Agregar Fila de Mantenimiento
            </button>
            <div class="total-summary">
              <strong>
                Costo Total Mantenimiento (S/):
                {{ costoTotal.toFixed(2) }}
              </strong>
            </div>
          </template>

          <!-- Servicio -->
          <template v-if="formData.tipoOperacion === 'servicio'">
            <h3 class="section-title">Detalles del Servicio</h3>
            <div
              v-for="(serv, index) in formData.servicios"
              :key="serv.id"
              class="dynamic-row service-row"
            >
              <div class="form-group service-description-group">
                <label :for="'descripcionServicio-' + serv.id">
                  Descripción del Servicio:
                </label>
                <input
                  type="text"
                  :id="'descripcionServicio-' + serv.id"
                  v-model="serv.descripcionServicio"
                  placeholder="Especifique el servicio"
                  required
                />
              </div>
              <div class="form-group service-cost-group">
                <label :for="'costoServicio-' + serv.id">
                  Costo (S/):
                </label>
                <input
                  type="number"
                  :id="'costoServicio-' + serv.id"
                  v-model.number="serv.costoServicio"
                  placeholder="S/ Costo"
                  min="0"
                  step="0.01"
                  required
                />
              </div>
              <button
                type="button"
                @click="removeServicioRow(serv.id)"
                class="btn-remove-row"
                title="Eliminar fila"
              >&times;</button>
            </div>
            <button
              type="button"
              @click="addServicioRow"
              class="btn-add-row"
            >
              <span class="plus-icon">+</span> Agregar Fila de Servicio
            </button>
            <div class="total-summary">
              <strong>
                Costo Total Servicio (S/):
                {{ costoTotalServicio.toFixed(2) }}
              </strong>
            </div>
          </template>

          <div class="form-group descripcion-group" v-if="formData.tipoOperacion">
            <label for="descripcion">Descripción Adicional (Opcional):</label>
            <textarea
              id="descripcion"
              v-model="formData.descripcion"
              placeholder="Agregue información adicional aquí..."
              rows="3"
            ></textarea>
          </div>
        </div>
      </transition>

      <div v-if="mensaje" :class="['mensaje', tipoMensaje]">
        {{ mensaje }}
      </div>

      <div class="form-actions">
        <button
          type="submit"
          :disabled="loading"
          class="btn-submit"
        >
          {{ loading ? 'Enviando...' : 'Registrar Operación' }}
        </button>
        <button
          type="button"
          @click="resetForm"
          class="btn-reset"
          :disabled="loading"
        >
          Limpiar Formulario
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { useOpForm } from '../composables/useOpForm.js';

const emits = defineEmits(['datos-enviados']);

const {
  formData,
  loading,
  mensaje,
  tipoMensaje,

  addCombustibleRow,
  removeCombustibleRow,

  addMantenimientoRow,
  removeMantenimientoRow,
  updateSugerencias,
  selectItem,
  blurHandler,
  sugerencias,
  inputActivo,
  //updateSubtotal,
  costoTotalCombustible,
  costoTotalServicio,
  costoTotal,

  addServicioRow,
  removeServicioRow,

  resetForm,
  submitForm 
} = useOpForm();

async function enviarFormulario() {
  loading.value = true;
  try {
    const response = await submitForm();
    mensaje.value = 'Operación registrada exitosamente.';
    tipoMensaje.value = 'success';
    emits('datos-enviados', formData);
  } catch (error) {
    mensaje.value = 'Error al registrar la operación. Intente nuevamente.';
    tipoMensaje.value = 'error';
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped src="../assets/styles/FormularioOperacion.css"></style>