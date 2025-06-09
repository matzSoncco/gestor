import { ref } from 'vue';

const mensajeGlobal = ref('');
const tipoMensajeGlobal = ref('success');
const modalVisible = ref(false);

export default function useMensajeGlobal() {
  const mostrarMensaje = (mensaje, tipo = 'success') => {
    mensajeGlobal.value = mensaje;
    tipoMensajeGlobal.value = tipo;
    modalVisible.value = true;
  };
  const cerrarMensaje = () => {
    modalVisible.value = false;
    mensajeGlobal.value = '';
    tipoMensajeGlobal.value = 'success';
  };
  return {
    mensajeGlobal,
    tipoMensajeGlobal,
    modalVisible,
    mostrarMensaje,
    cerrarMensaje
  };
}