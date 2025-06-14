import api from '../services/api.js';

import { useFormActions } from './useFormActions';
import useMensajeGlobal from './useMensajeGlobal';

export function useVehiculos () {
  const defaults = {
    placa: '',
    anio: null,
    kilometraje: 0,
    costo: 0,
    modelo: '',
    ubicacion: '',
    categoria: '',
    marca: '',
    modelo: '',
    version: '',
    color: '',
    anio_fabricacion: null,
    anio_modelo: null,
    motor: '',
    combustible: '',
    forma_rodante: '',
    vin: '',
    serie_chasis: '',
    ejes: 0,
    ruedas: 0,
    pasajeros: 0,
    carroceria: '',
    peso_neto: 0,
    peso_bruto: 0,
    carga_util: 0,
    cilindradada: 0,
    cilindros: 0,
    altura: 0,
    ancho: 0,
    longitud: 0,
  };

  const { mostrarMensaje } = useMensajeGlobal();

  const onSubmitService = async (payload) => {
    try {
      await api.post('vehiculos/', payload);
      mostrarMensaje('Vehículo guardado exitosamente', 'success');
      resetForm();
    } catch (error) {
      console.error('Error al guardar vehículo:', error);
      mostrarMensaje('Error al guardar vehículo', 'error');
    }
  };

  const {
    formData,
    loading,
    resetForm,
    submitForm,
  } = useFormActions({defaults, onSubmitService, extraComputed: {} });

  return {
    formData,
    loading,
    resetForm,
    submitForm,
  };
}