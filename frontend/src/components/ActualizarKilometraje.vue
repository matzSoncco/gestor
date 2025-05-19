<template>
  <div class="formulario-container">
    <form @submit.prevent="actualizarKilometraje" class="formulario-registro">
      <h2 class="form-title">Actualizar Kilometraje de Vehículo</h2>
      
      <div class="form-grid">
        <div class="form-group">
          <label for="vehiculoSeleccionado">Vehículo:</label>
          <select id="vehiculoSeleccionado" v-model="vehiculoId" required class="select-custom" @change="cargarDatosVehiculo">
            <option value="" disabled>Seleccione un vehículo</option>
            <option v-for="vehiculo in listaVehiculos" :key="vehiculo.id" :value="vehiculo.id">
              {{ vehiculo.placa }} - {{ vehiculo.tarjetaVehiculo.marca }} {{ vehiculo.tarjetaVehiculo.modelo }}
            </option>
          </select>
        </div>
      </div>
      
      <div v-if="vehiculoSeleccionado" class="info-vehiculo">
        <div class="form-grid">
          <div class="form-group">
            <label>Placa:</label>
            <span class="info-text">{{ vehiculoSeleccionado.placa }}</span>
          </div>
          <div class="form-group">
            <label>Marca / Modelo:</label>
            <span class="info-text">{{ vehiculoSeleccionado.tarjetaVehiculo.marca }} {{ vehiculoSeleccionado.tarjetaVehiculo.modelo }}</span>
          </div>
        </div>
        
        <div class="form-grid">
          <div class="form-group">
            <label>Kilometraje Actual:</label>
            <span class="info-text">{{ vehiculoSeleccionado.kilometraje.toFixed(2) }} km</span>
          </div>
          <div class="form-group">
            <label for="nuevoKilometraje">Nuevo Kilometraje (km):</label>
            <input 
              type="number" 
              id="nuevoKilometraje" 
              v-model.number="nuevoKilometraje" 
              placeholder="Ingrese el nuevo kilometraje" 
              required 
              step="0.01"
              min="0"
              :min="vehiculoSeleccionado.kilometraje" 
            />
            <small v-if="errorKilometraje" class="error-mensaje">{{ errorKilometraje }}</small>
          </div>
        </div>
        
        <div class="form-grid">
          <div class="form-group">
            <label for="fecha">Fecha de Lectura:</label>
            <input type="date" id="fecha" v-model="fechaLectura" required />
          </div>
          <div class="form-group">
            <label for="ubicacionActual">Ubicación Actual:</label>
            <input type="text" id="ubicacionActual" v-model="ubicacionActual" placeholder="Lugar donde se encuentra el vehículo" required />
          </div>
        </div>
        
        <div class="form-group descripcion-group">
          <label for="observacion">Observaciones (Opcional):</label>
          <textarea id="observacion" v-model="observacion" placeholder="Anote detalles sobre el estado del vehículo, razón del cambio, etc." rows="3"></textarea>
        </div>
        
        <div v-if="mantenimientoProximo" class="mensaje alerta">
          <strong>¡Atención!</strong> Este vehículo está próximo a requerir mantenimiento en {{ mantenimientoProximo.kilometrosRestantes.toFixed(2) }} km.
          <div>Tipo de mantenimiento: {{ mantenimientoProximo.tipoMantenimiento }}</div>
        </div>
      </div>
      
      <div v-if="mensaje" :class="['mensaje', tipoMensaje]">
        {{ mensaje }}
      </div>
      
      <div class="form-actions">
        <button type="submit" :disabled="loading || !vehiculoSeleccionado || errorKilometraje" class="btn-submit">
          {{ loading ? 'Actualizando...' : 'Actualizar Kilometraje' }}
        </button>
        <button type="button" @click="resetForm" class="btn-reset" :disabled="loading">
          Cancelar
        </button>
      </div>
    </form>
    
    <!-- Historial de Kilometraje si se desea mostrar -->
    <div v-if="vehiculoSeleccionado && historialKilometraje.length > 0" class="seccion-historial">
      <h3 class="section-title">Historial de Kilometraje</h3>
      <div class="tabla-container">
        <table class="tabla-historial">
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Kilometraje</th>
              <th>Incremento</th>
              <th>Ubicación</th>
              <th>Observación</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(registro, index) in historialKilometraje" :key="index">
              <td>{{ formatearFecha(registro.fecha) }}</td>
              <td>{{ registro.kilometraje.toFixed(2) }} km</td>
              <td>{{ (index > 0 ? registro.kilometraje - historialKilometraje[index-1].kilometraje : 0).toFixed(2) }} km</td>
              <td>{{ registro.ubicacion }}</td>
              <td>{{ registro.observacion || '-' }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>