import api from '../services/api.js';

import { useFormActions } from './useFormActions';
import useMensajeGlobal from './useMensajeGlobal';

export function useVehiculos () {
  const defaults = {
    placa: '',
    anio: 2024,
    kilometraje: 0,
    costo: 0,
    ubicacion: '',
    categoria: '',
    marca: '',
    modelo: '',
    version: '',
    color: '',
    anio_fabricacion: 2024,
    anio_modelo: 2024,
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
    cilindrada: 0,
    cilindros: 0,
    altura: 0,
    ancho: 0,
    longitud: 0,
  };

  const { mostrarExito, mostrarError, mostrarInfo, mostrarAdvertencia } = useMensajeGlobal();

  const onSubmitService = async (payload) => {
    try {
      const response = await api.post('vehiculos/', payload);
      mostrarExito('Vehículo registrado exitosamente', 'success');
      return response.data; // Retorna la respuesta para usar en useFormActions
    } catch (error) {
      console.error('Error al guardar vehículo:', error);
      
      // Manejo de errores más específico
      if (error.response?.data) {
        const errorData = error.response.data;
        let mensajeError = 'Error al registrar vehículo:\n';
        
        // Mostrar errores específicos de validación
        Object.keys(errorData).forEach(field => {
          if (Array.isArray(errorData[field])) {
            mensajeError += `${field}: ${errorData[field].join(', ')}\n`;
          }
        });
        
        mostrarError(mensajeError, 'error');
      } else {
        mostrarError('Error de conexión. Intente nuevamente.', 'error');
      }
      
      throw error; // Re-lanza el error para que useFormActions lo maneje
    }
  };

  const {
    formData,
    loading,
    resetForm: originalResetForm,
    submitForm,
  } = useFormActions({defaults, onSubmitService, extraComputed: {} });

  const resetForm = async() => {
    await originalResetForm();
    mostrarInfo('Formulado limpiado correctamente', 'info')
  }

  return {
    formData,
    loading,
    resetForm,
    submitForm,
  };
}