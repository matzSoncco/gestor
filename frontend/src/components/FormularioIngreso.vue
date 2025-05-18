<template>
  <div class="formulario-container">
    <form @submit.prevent="enviarFormulario" class="formulario-registro">
      <h2 class="form-title">Registro de Operacion</h2>
      
      <!-- Campos comunes -->
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
              readonly
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
import useFormLogic from '../composables/useFormularioDatos.js';

const { formData, loading, enviarFormulario, resetForm } = useFormLogic();
</script>

<style scoped src="../assets/styles/FormularioOperacion.css"></style>