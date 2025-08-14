import { ref, nextTick } from 'vue'
import { useVehiculoStore } from '@/stores/vehiculoStore'
import { useNotify } from '@/composables/global/useNotify'
import { useFormActions } from '@/composables/global/useFormActions'
import { usePagination } from '../global/usePagination'
import { handleApiError } from '@/utils/apiErrorHandler'
import { FIELD_NAMES_VEHICULO } from "@/types/fieldNames";
import type { FieldNameMap } from '@/types/fieldNames'

import {
  fetchVehiculos,
  createVehiculo,
  updateVehiculo,
  deleteVehiculo
} from '@/api/vehiculos'

import {
  makeVehiculoDefaults,
  type Vehiculo
} from '@/types/vehiculo'

const formErrors = ref<Record<string, string[]>>({});
const clearErrors = () => {
  formErrors.value = {};
};

function validateVehiculo(p: Partial<Vehiculo>): string | null {
  formErrors.value = {}; // limpiar errores previos

  // 1. Campos requeridos tipo texto
  const requiredText: (keyof Vehiculo)[] = [
    'placa',
    'marca',
    'modelo',
    'ubicacion',
    'categoria',
    'version',
    'color',
    'motor',
    'combustible',
    'forma_rodante',
    'vin',
    'serie_chasis',
    'carroceria'
  ];

  for (const field of requiredText) {
    if (!p[field] || String(p[field]).trim() === '') {
      formErrors.value[field] = [
        `El campo "${currentFieldNames.value[field] || field}" es obligatorio.`
      ];
    }
  }

  // 2. Campos numéricos que deben ser > 0
  const numericRequired: (keyof Vehiculo)[] = [
    'anio',
    'kilometraje',
    'costo',
    'anio_fabricacion',
    'anio_modelo',
    'ejes',
    'ruedas',
    'pasajeros',
    'peso_neto',
    'peso_bruto',
    'carga_util',
    'cilindrada',
    'cilindros',
    'altura',
    'ancho',
    'longitud'
  ];

  for (const field of numericRequired) {
    const value = p[field] as number | null | undefined;
    if (value == null || value <= 0) {
      formErrors.value[field] = [
        `El campo "${currentFieldNames.value[field] || field}" debe ser mayor a 0.`
      ];
    }
  }

  return Object.keys(formErrors.value).length > 0
    ? 'Corrige los errores en el formulario.'
    : null;
}

const currentFieldNames = ref<FieldNameMap>(FIELD_NAMES_VEHICULO);

export function useVehiculos() {
  const vehiculoStore = useVehiculoStore();
  const isResetting = ref(false);
  const defaults = makeVehiculoDefaults();
  const { success, error, info, warning } = useNotify();

  const filtros = ref({
    placa: ''
  })

  const {
    items: vehiculos,
    total,
    currentPage,
    pageSize,
    loading,
    load: loadVehiculos,
    setPage,
    params
  } = usePagination<Vehiculo>({
    fetcher: fetchVehiculos,
    pageSize: 6
  })

  const syncStoreWithPagination  = () => { //cambio de nombre a una más descriptiva
    vehiculoStore.setVehiculos(vehiculos.value)
  }

  const updateVehiculoInBothSources  = (updated: Vehiculo) => {
    //ctualizar store global
    vehiculoStore.actualizarVehiculo(updated)
    
    //actualizar items paginados (si está en la pag actual)
    const idx = vehiculos.value.findIndex(v => v.id === updated.id)
    if (idx !== -1) {
      vehiculos.value[idx] = { ...vehiculos.value[idx], ...updated }
    }
  }

  const aplicarFiltros = () => {
    const hayFiltros = filtros.value.placa.trim() !== ''

    if (!hayFiltros) {
      setPage(1);
    }

    const filtrosParams: Record<string, any> = {};

    if (filtros.value.placa.trim()) {
      filtrosParams.placa = filtros.value.placa.trim();
    }

    params.value = filtrosParams;
    loadVehiculos()
  }

  const loadData = async () => { //evitamos confucion con loadVehiculos
    await loadVehiculos()
    syncStoreWithPagination() //sincronizar después de cargar
  }

  /* -------- crear -------- */
  const createVehiculoAction = async (payload: Partial<Vehiculo>) => {
    // 1) Validación local
    const msg = validateVehiculo(payload);
    if (msg) {
      error(msg);
      throw new Error(msg);
    }

    try {
      // 2) Llamada API
      const data = await createVehiculo(payload);

      // 3) Estado local
      vehiculos.value = [data, ...vehiculos.value];
      vehiculoStore.setVehiculos([data, ...vehiculoStore.vehiculos]);

      success("Vehículo creado exitosamente");
      return data;

    } catch (err) {
      // 4) Manejo de errores consistente
      const apiErr = handleApiError(err, {
        context: "vehículo",
        fieldNames: currentFieldNames.value, // asegúrate de tener esto igual que en operaciones
      });

      error(apiErr.detail || "Ocurrió un error");

      if (apiErr.errors) {
        formErrors.value = apiErr.errors;

        const keys = Object.keys(apiErr.errors);
        if (keys.length > 1) {
          warning("Se encontraron errores en varios campos. Revísalos y corrige la información.");
        }
      } else {
        clearErrors();
      }

      // Manejo por código (opcional según tu API)
      switch (apiErr.code) {
        case "UNAUTHENTICATED":
          warning("Tu sesión ha expirado.");
          break;
        case "FORBIDDEN":
          error("No tienes permisos para crear vehículos.");
          break;
        case "SERVER_ERROR":
          error("Error temporal del servidor.");
          break;
      }

      throw apiErr;
    }
  };

  /* -------- editar -------- */
  const updateVehiculoAction  = async (id: number, payload: Partial<Vehiculo>) => {
    try {
      const data = await updateVehiculo(id, payload)
      updateVehiculoInBothSources(data)
      success('Vehículo actualizado exitosamente')
      return data
    } catch (err) {
      error('Error al actualizar el vehículo')
      throw err
    }
  }

  /* -------- eliminar -------- */
  const deleteVehiculoAction = async (id: number) => {
    try {
      await deleteVehiculo(id)
      
      // Remover de ambas fuentes
      vehiculos.value = vehiculos.value.filter(v => v.id !== id)
      vehiculoStore.setVehiculos(vehiculoStore.vehiculos.filter(v => v.id !== id))
      
      success('Vehículo eliminado exitosamente')
    } catch (err) {
      error('Error al eliminar el vehículo')
      throw err
    }
  }

  /* -------- formulario reusable -------- */
  const {
    formData,
    loading: formLoading,
    resetForm: baseReset,
    submitForm
  } = useFormActions<Vehiculo>({
    defaults,
    onSubmitService: createVehiculoAction,
    onResetCallback: () => info('Formulario limpiado'),
  })

  const resetForm = async () => {
    isResetting.value = true;
    await baseReset();
    await nextTick();
    isResetting.value = false;
  }

  const refresh = async () => {
    await loadData()
    info('Datos actualizados')
  }

  /* -------- API pública del composable -------- */
  return {
    vehiculos,
    loading,
    total,
    currentPage,
    pageSize,
    setPage,

    filtros,
    aplicarFiltros,

    formData,
    formLoading,
    resetForm,
    submitForm,
    formErrors,

    loadData,
    createVehiculo: createVehiculoAction, // Para crear programáticamente
    updateVehiculo: updateVehiculoAction,
    deleteVehiculo: deleteVehiculoAction,
    
    refresh,

    updateVehiculoInBothSources,
    syncStoreWithPagination,
    
    isResetting
  }
}