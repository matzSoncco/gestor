import { ref } from 'vue';

// Variables reactivas globales (singleton)
const mensajeGlobal = ref('');
const tipoMensajeGlobal = ref('success');
const modalVisible = ref(false);

// Timer para auto-cerrar mensajes
let timeoutId = null;

export default function useMensajeGlobal() {
  const mostrarMensaje = (mensaje, tipo = 'success', autoClose = true, duration = 4000) => {
    // Limpiar timeout anterior si existe
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }

    mensajeGlobal.value = mensaje;
    tipoMensajeGlobal.value = tipo;
    modalVisible.value = true;

    // Auto-cerrar mensaje después del tiempo especificado
    if (autoClose && tipo !== 'error') { // Los errores no se cierran automáticamente
      timeoutId = setTimeout(() => {
        cerrarMensaje();
      }, duration);
    }
  };

  const cerrarMensaje = () => {
    modalVisible.value = false;
    mensajeGlobal.value = '';
    tipoMensajeGlobal.value = 'success';
    
    // Limpiar timeout si existe
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
  };

  // Métodos de conveniencia
  const mostrarExito = (mensaje, autoClose = true) => {
    mostrarMensaje(mensaje, 'success', autoClose);
  };

  const mostrarError = (mensaje, autoClose = false) => {
    mostrarMensaje(mensaje, 'error', autoClose);
  };

  const mostrarInfo = (mensaje, autoClose = true) => {
    mostrarMensaje(mensaje, 'info', autoClose);
  };

  const mostrarAdvertencia = (mensaje, autoClose = true) => {
    mostrarMensaje(mensaje, 'warning', autoClose);
  };

  return {
    // Estado
    mensajeGlobal,
    tipoMensajeGlobal,
    modalVisible,
    
    // Métodos principales
    mostrarMensaje,
    cerrarMensaje,
    
    // Métodos de conveniencia
    mostrarExito,
    mostrarError,
    mostrarInfo,
    mostrarAdvertencia,
  };
}