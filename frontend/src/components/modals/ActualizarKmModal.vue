<template>
  <div v-if="visible" class="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center px-4">
    <div class="bg-white dark:bg-neutral-900 w-full max-w-lg rounded-xl shadow-xl overflow-hidden animate-fade-in ring-1 ring-black/10 dark:ring-white/10">
      
      <!-- Header -->
      <div class="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-white/10">
        <h2 class="text-xl font-semibold text-gray-800 dark:text-white">Actualizar Kilometraje</h2>
        <button
          @click="close"
          class="text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-white transition text-xl"
        >
          &times;
        </button>
      </div>

      <!-- Body -->
      <div class="px-6 py-5">
        <div v-if="loading" class="text-center text-gray-500 dark:text-gray-400">
          <span class="italic">Cargando datos…</span>
        </div>

        <div v-else-if="error" class="text-center text-red-600 dark:text-red-400 space-y-2">
          <p>{{ errorMessage }}</p>
          <button @click="loadVehicle" class="text-blue-600 hover:underline text-sm">
            Reintentar
          </button>
        </div>

        <div v-else-if="vehiculo" class="space-y-6">
          <!-- Info vehículo -->
          <div class="text-sm text-gray-700 dark:text-gray-300">
            <p><strong class="text-gray-900 dark:text-white">Placa:</strong> {{ vehiculo.placa }}</p>
            <p><strong class="text-gray-900 dark:text-white">Kilometraje actual:</strong> {{ vehiculo.kilometraje }} km</p>
          </div>

          <!-- Formulario -->
          <form @submit.prevent="submit" class="space-y-4">
            <div>
              <label for="inputKm" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Nuevo kilometraje (km)
              </label>
              <input
                id="inputKm"
                type="number"
                v-model.number="nuevoKilometraje"
                :min="Number(vehiculo.kilometraje)"
                class="block w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-neutral-800 text-gray-800 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                required
              />
              <p v-if="errorKilometraje" class="text-red-500 text-sm mt-1">
                {{ errorKilometraje }}
              </p>
            </div>

            <!-- Botones -->
            <div class="flex justify-end gap-2 pt-4">
              <button
                type="button"
                class="px-4 py-2 text-sm font-medium rounded-md bg-gray-100 dark:bg-neutral-700 text-gray-700 dark:text-white hover:bg-gray-200 dark:hover:bg-neutral-600 transition"
                :disabled="submitting"
                @click="close"
              >
                Cancelar
              </button>
              <button
                type="submit"
                class="px-4 py-2 text-sm font-medium rounded-md bg-blue-600 hover:bg-blue-700 text-white transition disabled:opacity-50 disabled:cursor-not-allowed"
                :disabled="submitting"
              >
                {{ submitting ? 'Guardando…' : 'Guardar' }}
              </button>
            </div>
          </form>
        </div>

        <div v-else class="text-center text-sm text-gray-500 dark:text-gray-400">
          <p>No se encontró el vehículo.</p>
          <button @click="loadVehicle" class="text-blue-600 hover:underline text-xs mt-1">
            Cargar datos
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { watch, nextTick, computed, ref } from 'vue';
import { useVehiculoDetalle } from '@/composables/vehiculos/useVehiculoDetalle';
import { useActualizarKilometraje } from '@/composables/vehiculos/useActualizarKilometraje';
import { Vehiculo } from '@/types/vehiculo';

const props = defineProps<{
  visible: boolean;
  vehicleId: string | number | null;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'saved', v: Vehiculo): void;
}>();

/* --- composables --- */
const {
  vehiculo,
  loading,
  error,
  fetchVehiculo,
  updateKilometraje,
  resetVehiculo,
} = useVehiculoDetalle();

const {
  nuevoKilometraje,
  errorKilometraje,
  validarKilometraje,
  reset,
} = useActualizarKilometraje();

/* estado local extra */
const submitting = ref(false);
const errorMessage = computed(() => (error.value as any)?.message ?? error.value);

/* --- helpers --- */
async function loadVehicle() {
  if (!props.vehicleId) return;
  resetVehiculo();
  try {
    await fetchVehiculo(props.vehicleId);
    nuevoKilometraje.value = Number(vehiculo.value!.kilometraje);
  } catch {
    /* error ya manejado en composable */
  }
}

async function submit() {
  if (!vehiculo.value) {
    errorKilometraje.value = 'Vehículo no cargado.';
    return;
  }
  if (!validarKilometraje()) return;

  submitting.value = true;
  try {
    const updated = await updateKilometraje(props.vehicleId!, nuevoKilometraje.value);
    emit('saved', updated);
    close();
  } finally {
    submitting.value = false;
  }
}

function close() {
  emit('close');
  resetVehiculo();
  reset();
}

/* --- watches --- */
watch(
  [() => props.visible, () => props.vehicleId],
  async ([vis, id]) => {
    if (vis && id) {
      await nextTick();
      await loadVehicle();
    }
  },
  { immediate: true },
);
</script>

<style scoped>
@keyframes fade-in {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-fade-in {
  animation: fade-in 0.2s ease-out;
}
</style>