<!-- src/components/ActualizarKmModal.vue -->
<template>
  <div v-if="visible" class="modal-overlay">
    <div class="modal-container">
      <header class="modal-header">
        <h3 class="modal-title">Actualizar Kilometraje</h3>
        <button type="button" class="modal-close" @click="onClose" aria-label="Cerrar modal">×</button>
      </header>

      <section class="modal-body">
        <div v-if="loading" class="modal-loading">
          <p>Cargando datos...</p>
        </div>

        <div v-else-if="error" class="modal-error">
          <p>Error: {{ error.message || error }}</p>
          <button @click="loadVehicle" class="btn-secondary small-btn">
            Reintentar
          </button>
        </div>

        <div v-else-if="vehiculo">
          <p class="field-info">Placa: <strong>{{ vehiculo.placa }}</strong></p>
          <p class="field-info">Kilometraje actual: {{ vehiculo.kilometraje }} km</p>

          <form @submit.prevent="onSubmit" class="modal-form">
            <div class="form-group">
              <label for="inputKm" class="form-label">Nuevo kilometraje (km):</label>
              <input
                id="inputKm"
                type="number"
                v-model.number="nuevoKm"
                :min="parseFloat(vehiculo.kilometraje)"
                class="input-field"
                required
              />
            </div>
            <div v-if="errorMsg" class="error-text">{{ errorMsg }}</div>

            <footer class="modal-footer">
              <button
                type="button"
                @click="onClose"
                :disabled="loadingSubmit"
                class="btn-secondary"
              >Cancelar</button>
              <button
                type="submit"
                :disabled="loadingSubmit"
                class="btn-primary"
              >
                {{ loadingSubmit ? 'Guardando...' : 'Guardar' }}
              </button>
            </footer>
          </form>
        </div>

        <div v-else class="modal-error">
          <p>No se encontró el vehículo.</p>
          <button @click="loadVehicle" class="btn-secondary small-btn">
            Cargar datos
          </button>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, nextTick } from 'vue'
import { useVehiculoDetalle } from '../composables/useVehiculoDetalle.js'

const props = defineProps({
  visible: Boolean,
  vehicleId: {
    type: [String, Number],
    required: true
  }
})
const emit = defineEmits(['close', 'saved'])

const { vehiculo, loading, error, fetchVehiculo, updateKilometraje, resetVehiculo } = useVehiculoDetalle()

const nuevoKm = ref(null)
const errorMsg = ref(null)
const loadingSubmit = ref(false)

const loadVehicle = async () => {
  if (!props.vehicleId) return
  errorMsg.value = null
  resetVehiculo()
  try {
    await fetchVehiculo(props.vehicleId)
    nuevoKm.value = vehiculo.value ? parseFloat(vehiculo.value.kilometraje) : null
  } catch (err) {
    console.error('Error loading vehicle:', err)
  }
}

watch(
  [() => props.visible, () => props.vehicleId],
  async ([visible, vehicleId]) => {
    if (visible && vehicleId) {
      await nextTick()
      await loadVehicle()
    }
  },
  { immediate: true }
)

const onSubmit = async () => {
  errorMsg.value = null
  if (!vehiculo.value) {
    errorMsg.value = 'Vehículo no cargado.'
    return
  }
  const currentKm = parseFloat(vehiculo.value.kilometraje)
  if (nuevoKm.value < currentKm) {
    errorMsg.value = `Debe ser ≥ ${currentKm}`
    return
  }
  loadingSubmit.value = true
  try {
    const updated = await updateKilometraje(props.vehicleId, nuevoKm.value)
    emit('saved', updated)
    onClose()
  } catch (err) {
    console.error('Error updating kilometraje:', err)
    errorMsg.value = 'No se pudo actualizar el kilometraje'
  } finally {
    loadingSubmit.value = false
  }
}

const onClose = () => {
  emit('close')
  errorMsg.value = null
  resetVehiculo()
}
</script>

<style scoped>
/* Overlay semitransparente */
.modal-overlay {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: fadeIn 0.2s ease-out;
}

/* Contenedor del modal */
.modal-container {
  background-color: #ffffff;
  border-radius: 0.5rem; /* 8px */
  width: 20rem; /* 320px */
  max-width: 90%;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  animation: slideDown 0.3s ease-out;
}

/* Cabecera */
.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1rem;
  background-color: #f9fafb;
  border-bottom: 1px solid #e5e7eb;
}

.modal-title {
  font-size: 1.125rem; /* 18px */
  font-weight: 600;
  margin: 0;
}

.modal-close {
  background: transparent;
  border: none;
  font-size: 1.25rem;
  line-height: 1;
  cursor: pointer;
  color: #6b7280;
  padding: 0 0.25rem;
  transition: color 0.2s;
}
.modal-close:hover {
  color: #111827;
}

/* Cuerpo */
.modal-body {
  padding: 1rem;
}

.modal-loading,
.modal-error {
  text-align: center;
  margin-bottom: 1rem;
}

.field-info {
  margin-bottom: 0.5rem;
  color: #374151;
}

/* Formulario */
.modal-form {
  display: flex;
  flex-direction: column;
}

.form-group {
  margin-bottom: 0.75rem;
}

.form-label {
  display: block;
  font-size: 0.875rem;
  margin-bottom: 0.25rem;
  color: #4b5563;
}

.input-field {
  width: 70%;
  background-color: #d1d5db;
  padding: 0.5rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  color: #01060f;
  transition: border-color 0.2s, box-shadow 0.2s;
}
.input-field:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
}

.error-text {
  color: #b91c1c;
  font-size: 0.875rem;
  margin-bottom: 0.75rem;
}

/* Pie del modal */
.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

/* Botones */
.btn-primary {
  background-color: #3b82f6;
  color: #ffffff;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  border: none;
  font-size: 0.875rem;
  cursor: pointer;
  transition: background-color 0.2s;
}
.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
.btn-primary:hover:not(:disabled) {
  background-color: #2563eb;
}

.btn-secondary {
  background-color: #e5e7eb;
  color: #374151;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  border: none;
  font-size: 0.875rem;
  cursor: pointer;
  transition: background-color 0.2s;
}
.btn-secondary:hover {
  background-color: #d1d5db;
}
.btn-secondary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Botón pequeño para reintentar */
.small-btn {
  padding: 0.25rem 0.5rem;
  font-size: 0.75rem;
}

/* Animaciones */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
@keyframes slideDown {
  from { transform: translateY(-10%); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}
</style>