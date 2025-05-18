// FormularioRegistro.js (o useFormularioDatos.js)
import { ref, reactive, watch, computed } from 'vue';
// Ajusta esta ruta según tu estructura
import apiService from '../services/apiService.js';

// Función para generar IDs únicos para las filas
const generateId = () => `id_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 7)}`;

export default function useFormularioRegistro(props, { emit }) {
  const formData = reactive({
    numeroDocumento: '',
    rucProveedor: '',
    nombreProveedor: '',
    tipoOperacion: '', // 'combustible', 'mantenimiento', 'servicio'
    fecha: '',
    descripcion: '', // Común para todos

    // Detalles para Combustible (array de filas)
    combustibles: [], // { id, cantidadGalones, costoPorGalon, subtotal, placaVehiculo }

    // Detalles para Mantenimiento (array de filas)
    mantenimientos: [], // { id, descripcionItem, cantidad, costoUnitario, subtotalItem }

    // Detalles para Servicio (array de filas)
    servicios: [], // { id, descripcionServicio, costoServicio }
  });

  const loading = ref(false);
  const mensaje = ref('');
  const tipoMensaje = ref('');

  // --- Lógica para Combustible ---
  const addCombustibleRow = () => {
    formData.combustibles.push({
      id: generateId(),
      cantidadGalones: null,
      costoPorGalon: null,
      subtotal: 0,
      placaVehiculo: '',
    });
  };

  const removeCombustibleRow = (id) => {
    formData.combustibles = formData.combustibles.filter(c => c.id !== id);
  };

  const updateTotalCombustible = () => {
    formData.combustibles.forEach(c => {
      const cantidad = parseFloat(c.cantidadGalones) || 0;
      const costo = parseFloat(c.costoPorGalon) || 0;
      c.subtotal = parseFloat((cantidad * costo).toFixed(2));
    });
  };
  watch(() => formData.combustibles, updateTotalCombustible, { deep: true });

  const costoTotalCombustible = computed(() => {
    return parseFloat(formData.combustibles.reduce((sum, c) => sum + (c.subtotal || 0), 0).toFixed(2));
  });


  // --- Lógica para Mantenimiento ---
  const knownMaintenanceItems = ref(['Filtro de aceite', 'Llantas', 'Pastillas de freno', 'Cambio de aceite', 'Alineamiento y Balanceo']); // Items de ejemplo
  const maintenanceItemSuggestions = ref([]);
  const activeMaintenanceItemInput = ref(null); // Para saber qué input de item está activo

  const addMantenimientoRow = () => {
    formData.mantenimientos.push({
      id: generateId(),
      descripcionItem: '',
      cantidad: 1,
      costoUnitario: null,
      subtotalItem: 0,
    });
  };

  const removeMantenimientoRow = (id) => {
    formData.mantenimientos = formData.mantenimientos.filter(m => m.id !== id);
  };

  const updateMantenimientoSuggestions = (event, rowIndex) => {
    const query = event.target.value.toLowerCase();
    if (query) {
      maintenanceItemSuggestions.value = knownMaintenanceItems.value.filter(item =>
        item.toLowerCase().includes(query)
      );
    } else {
      maintenanceItemSuggestions.value = [];
    }
    activeMaintenanceItemInput.value = rowIndex; // Guarda el índice de la fila activa
  };

  const selectMaintenanceItem = (item, rowIndex) => {
    if (formData.mantenimientos[rowIndex]) {
      formData.mantenimientos[rowIndex].descripcionItem = item;
    }
    maintenanceItemSuggestions.value = [];
    activeMaintenanceItemInput.value = null;
  };

  const handleMantenimientoItemBlur = (rowIndex) => {
    // Pequeño delay para permitir que el click en la sugerencia se procese
    setTimeout(() => {
        const currentItemText = formData.mantenimientos[rowIndex]?.descripcionItem;
        if (currentItemText && !knownMaintenanceItems.value.includes(currentItemText)) {
            // Opcional: agregar nuevo item a la lista de conocidos para esta sesión
            // knownMaintenanceItems.value.push(currentItemText);
        }
        if (activeMaintenanceItemInput.value === rowIndex) { // Solo oculta si es el input activo
             maintenanceItemSuggestions.value = [];
             activeMaintenanceItemInput.value = null;
        }
    }, 150);
  };
  
  const handleMantenimientoItemFocus = (event, rowIndex) => {
    // Opcional: mostrar todas las sugerencias o las filtradas si ya hay texto
    updateMantenimientoSuggestions(event, rowIndex);
  };


  const updateTotalMantenimiento = () => {
    formData.mantenimientos.forEach(m => {
      const cantidad = parseFloat(m.cantidad) || 0;
      const costo = parseFloat(m.costoUnitario) || 0;
      m.subtotalItem = parseFloat((cantidad * costo).toFixed(2));
    });
  };
  watch(() => formData.mantenimientos, updateTotalMantenimiento, { deep: true });

  const costoTotalMantenimiento = computed(() => {
    return parseFloat(formData.mantenimientos.reduce((sum, m) => sum + (m.subtotalItem || 0), 0).toFixed(2));
  });

  // --- Lógica para Servicio ---
  const addServicioRow = () => {
    formData.servicios.push({
      id: generateId(),
      descripcionServicio: '',
      costoServicio: null,
    });
  };

  const removeServicioRow = (id) => {
    formData.servicios = formData.servicios.filter(s => s.id !== id);
  };

  const costoTotalServicio = computed(() => {
    return parseFloat(formData.servicios.reduce((sum, s) => sum + (parseFloat(s.costoServicio) || 0), 0).toFixed(2));
  });


  // --- Lógica Común del Formulario ---
  watch(() => formData.tipoOperacion, (newTipo) => {
    // Inicializa con una fila si el array está vacío para el tipo seleccionado
    if (newTipo === 'combustible' && formData.combustibles.length === 0) {
      addCombustibleRow();
    } else if (newTipo === 'mantenimiento' && formData.mantenimientos.length === 0) {
      addMantenimientoRow();
    } else if (newTipo === 'servicio' && formData.servicios.length === 0) {
      addServicioRow();
    }
  });

  const mostrarMensajeLocal = (msg, tipo = 'success', duracion = 3000) => {
    mensaje.value = msg;
    tipoMensaje.value = tipo;
    setTimeout(() => {
      mensaje.value = '';
      tipoMensaje.value = '';
    }, duracion);
  };

  const resetForm = () => {
    formData.numeroDocumento = '';
    formData.rucProveedor = '';
    formData.nombreProveedor = '';
    // formData.tipoOperacion = ''; // No resetear tipoOperacion para mantener las filas si se desea
    formData.fecha = '';
    formData.descripcion = '';
    
    formData.combustibles = [];
    formData.mantenimientos = [];
    formData.servicios = [];

    // Si se quiere una fila por defecto al limpiar para el tipo actual:
    const currentType = formData.tipoOperacion;
    if (currentType === 'combustible') addCombustibleRow();
    else if (currentType === 'mantenimiento') addMantenimientoRow();
    else if (currentType === 'servicio') addServicioRow();
    else if (!currentType) { // Si no hay tipo, y se quiere una fila por defecto al seleccionar el tipo
        // Se manejará con el watcher de tipoOperacion
    }


    mensaje.value = '';
    tipoMensaje.value = '';
  };

  const enviarFormulario = async () => {
    loading.value = true;
    try {
      // Prepara los datos a enviar. Podrías filtrar aquí
      // o enviar todo y que el backend decida.
      const dataToSubmit = {
        ...formData,
        // Si quieres enviar los totales calculados también:
        costoTotalCombustible: costoTotalCombustible.value,
        costoTotalMantenimiento: costoTotalMantenimiento.value,
        costoTotalServicio: costoTotalServicio.value,
      };

      const response = await apiService.submitFormData(dataToSubmit);
      mostrarMensajeLocal('Documento registrado correctamente.', 'success');
      emit('datos-enviados', {
        success: true,
        message: 'Datos del documento enviados con éxito.',
        data: response.data,
      });
      // Guardar el tipo de operación actual antes de resetear
      const currentTipoOperacion = formData.tipoOperacion;
      resetForm();
      // Restaurar el tipo de operación y dejar que el watcher añada la fila inicial
      formData.tipoOperacion = currentTipoOperacion;

    } catch (error) {
      console.error('Error al enviar formulario:', error);
      const errorMsg = error.response?.data?.detail || error.message || 'Error desconocido al enviar los datos.';
      mostrarMensajeLocal(`Error: ${errorMsg}`, 'error');
      emit('datos-enviados', {
        success: false,
        message: `Error al enviar datos: ${errorMsg}`,
      });
    } finally {
      loading.value = false;
    }
  };

  return {
    formData,
    loading,
    mensaje,
    tipoMensaje,
    // Combustible
    addCombustibleRow,
    removeCombustibleRow,
    costoTotalCombustible,
    // Mantenimiento
    addMantenimientoRow,
    removeMantenimientoRow,
    costoTotalMantenimiento,
    maintenanceItemSuggestions,
    activeMaintenanceItemInput,
    updateMantenimientoSuggestions,
    selectMaintenanceItem,
    handleMantenimientoItemBlur,
    handleMantenimientoItemFocus,
    // Servicio
    addServicioRow,
    removeServicioRow,
    costoTotalServicio,
    // Común
    resetForm,
    enviarFormulario,
  };
}