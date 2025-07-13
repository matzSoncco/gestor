import { useNotification } from 'naive-ui';

export function useIngresoDatos() {
  const notification = useNotification();

  const handleDatosEnviados = (r: { message: string; success: boolean; }) =>
    r.success
      ? notification.success({ title: 'Éxito', description: r.message })
      : notification.error({ title: 'Error', description: r.message });

  const handleCsvCargado = handleDatosEnviados;

  return { handleDatosEnviados, handleCsvCargado };
}