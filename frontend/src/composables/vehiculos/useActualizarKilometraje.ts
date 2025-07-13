// composables/useActualizarKilometraje.ts
import { ref, computed } from 'vue';

export function useActualizarKilometraje() {
  const vehiculoId = ref<number | ''>('');
  const vehiculoSeleccionado = ref(null);
  const nuevoKilometraje = ref<number>(0);
  const fechaLectura = ref<string>(new Date().toISOString().split('T')[0]);
  const observacion = ref('');
  const errorKilometraje = ref('');

  const validarKilometraje = () => {
    errorKilometraje.value = '';
    if (nuevoKilometraje.value < 0) {
      errorKilometraje.value = 'El kilometraje no puede ser negativo';
      return false;
    }
    return true;
  };

  const reset = () => {
    vehiculoId.value = '';
    vehiculoSeleccionado.value = null;
    nuevoKilometraje.value = 0;
    observacion.value = '';
    errorKilometraje.value = '';
    fechaLectura.value = new Date().toISOString().split('T')[0];
  };

  return {
    vehiculoId,
    vehiculoSeleccionado,
    nuevoKilometraje,
    fechaLectura,
    observacion,
    errorKilometraje,
    validarKilometraje,
    reset
  };
}