import useMensajeGlobal from '../../composables/global/useMensajeGlobal';

export default function useIngresoDatos() {
  const { mensajeGlobal, tipoMensajeGlobal, mostrarMensaje } = useMensajeGlobal();

  const handleDatosEnviados = (respuesta) => {
    mostrarMensaje(
      respuesta.message || 'Datos del formulario enviados correctamente.',
      respuesta.success ? 'success' : 'error'
    );
  };

  const handleCsvCargado = (respuesta) => {
    mostrarMensaje(
      respuesta.message || 'Archivo CSV procesado correctamente.',
      respuesta.success ? 'success' : 'error'
    );
  };

  return {
    mensajeGlobal,
    tipoMensajeGlobal,
    handleDatosEnviados,
    handleCsvCargado,
  };
}