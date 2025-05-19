import { ref, reactive, watch } from 'vue';
import apiService from '../services/apiService';

export default function useRegistroVehiculo() {
    // Definimos los datos del formulario como un objeto reactivo
    const formData = reactive({
        placa: '',
        anio: new Date().getFullYear(),
        kilometraje: 0,
        costo: 0,
        ubicacion: '',
        tarjetaVehiculo: {
            categoria: '',
            marca: '',
            modelo: '',
            version: '',
            color: '',
            anio_fabricacion: new Date().getFullYear(),
            anio_modelo: new Date().getFullYear(),
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
            longitud: 0
        } 
    });
    
    const loading = ref(false);
    const mensaje = ref('');
    const tipoMensaje = ref('');

    // Para enviar el formulario
    const enviarFormulario = async () => {
        loading.value = true;
        mensaje.value = '';
      
        try {
            // Validación básica
            if (formData.placa.length !== 6) {
                mostrarMensaje('La placa debe tener exactamente 6 caracteres', 'error');
                return null;
            }

            // Validación de campos numéricos negativos
            const camposNumericos = ['kilometraje', 'costo'];
            for (const campo of camposNumericos) {
                if (formData[campo] < 0) {
                    mostrarMensaje(`El campo ${campo} no puede ser negativo`, 'error');
                    return null;
                }
            }

            // Validación de campos numéricos en tarjetaVehiculo
            const camposTarjeta = [
                'anio_fabricacion', 'anio_modelo', 'ejes', 'ruedas', 'pasajeros',
                'cilindrada', 'cilindros', 'peso_neto', 'peso_bruto', 'carga_util',
                'altura', 'ancho', 'longitud'
            ];
          
            for (const campo of camposTarjeta) {
                if (formData.tarjetaVehiculo[campo] < 0) {
                    mostrarMensaje(`El campo ${campo} no puede ser negativo`, 'error');
                    return null;
                }
            }

            // Verificar que peso_bruto sea mayor que peso_neto
            if (formData.tarjetaVehiculo.peso_bruto <= formData.tarjetaVehiculo.peso_neto) {
                mostrarMensaje('El peso bruto debe ser mayor que el peso neto', 'error');
                return null;
            }

            // Verificar que carga_util sea peso_bruto - peso_neto
            const cargaCalculada = parseFloat((formData.tarjetaVehiculo.peso_bruto - formData.tarjetaVehiculo.peso_neto).toFixed(3));
            if (Math.abs(cargaCalculada - formData.tarjetaVehiculo.carga_util) > 0.001) {
                formData.tarjetaVehiculo.carga_util = cargaCalculada;
            }

            // Aquí iría la llamada a la API para guardar el vehículo
            // Simulación de llamada a API
            return new Promise((resolve) => {
                setTimeout(() => {
                    // Simular respuesta exitosa
                    mostrarMensaje('Vehículo registrado correctamente', 'exito');
                    resolve({...formData});
                }, 1500);
            });
        } catch (error) {
            mostrarMensaje('Error al procesar el formulario', 'error');
            return null;
        } finally {
            loading.value = false;
        }
    };

    const resetForm = () => {
        Object.assign(formData, {
            placa: '',
            anio: new Date().getFullYear(),
            kilometraje: 0,
            costo: 0,
            ubicacion: '',
            tarjetaVehiculo: {
                categoria: '',
                marca: '',
                modelo: '',
                version: '',
                color: '',
                anio_fabricacion: new Date().getFullYear(),
                anio_modelo: new Date().getFullYear(),
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
                longitud: 0
            }
        });
        mensaje.value = '';
    };

    const mostrarMensaje = (texto, tipo) => {
        mensaje.value = texto;
        tipoMensaje.value = tipo;
      
        // Auto-ocultar el mensaje después de 5 segundos
        setTimeout(() => {
            mensaje.value = '';
        }, 5000);
    };

    // Método para calcular automáticamente la carga útil
    const calcularCargaUtil = () => {
        if (formData.tarjetaVehiculo.peso_bruto > 0 && formData.tarjetaVehiculo.peso_neto > 0) {
            formData.tarjetaVehiculo.carga_util = parseFloat(
                (formData.tarjetaVehiculo.peso_bruto - formData.tarjetaVehiculo.peso_neto).toFixed(3)
            );
        }
    };
    
    // Configurar watchers
    watch(() => formData.tarjetaVehiculo.peso_bruto, calcularCargaUtil);
    watch(() => formData.tarjetaVehiculo.peso_neto, calcularCargaUtil);

    return {
        formData,
        loading,
        mensaje,
        tipoMensaje,
        enviarFormulario,
        resetForm,
        mostrarMensaje,
        calcularCargaUtil,
    };
}