import { ref } from 'vue';

const mensajeGlobal = ref('');
const tipoMensajeGlobal = ref(''); // 'success' o 'error'

const mostrarMensaje = (mensaje, tipo = 'success', duracion = 3000) => {
  mensajeGlobal.value = mensaje;
  tipoMensajeGlobal.value = tipo;
  
  setTimeout(() => {
    mensajeGlobal.value = '';
    tipoMensajeGlobal.value = '';
  }, duracion);
};

export default function useMensajeGlobal() {
  return {
    mensajeGlobal,
    tipoMensajeGlobal,
    mostrarMensaje,
  };
}