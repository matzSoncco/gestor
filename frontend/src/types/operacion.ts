export type TipoOperacion = 'combustible' | 'mantenimiento' | 'servicio' | '';

export interface OperacionResponse {
  count: number
  next: string | null
  previous: string | null
  results: Operacion[]
}

export interface Combustible {
  id: string;
  cantidad_galones: number;
  costo_por_galon: number;
  subtotal: number;
  igv?: number;
  total?: number;
  ubicacion: string;
  placa_vehiculo?: number;
}

export interface Mantenimiento {
  id: string;
  repuesto: string;
  cantidad: number;
  costo_unitario: number;
  subtotal: number;
  igv?: number;
  total?: number;
  placa_vehiculo?: number;
}

export interface Servicio {
  id: string;
  descripcion_item: string;
  subtotal: number;
  igv?: number;
  total?: number;
  placa_vehiculo?: number;
}

export interface Operacion {
  id: number
  numero_documento: string;
  ruc_proveedor: string;
  nombre_proveedor: string;
  tipo_operacion: TipoOperacion;
  fecha: string;
  descripcion: string;
  costo_total: string;
  combustibles: Combustible[];
  mantenimientos: Mantenimiento[];
  servicios: Servicio[];
}

export interface OperacionBackend {
  id: number
  numero_documento: string;
  ruc_proveedor: string;
  nombre_proveedor: string;
  tipo_operacion: TipoOperacion;
  fecha: string;
  descripcion: string;
  costo_total: string;
  combustible_detalle?: Combustible[];
  mantenimiento_detalle?: Mantenimiento[];
  servicio_detalle?: Servicio[];
}

export interface SugerenciaItem {
  label: string
  value: string
}

/**
 * Genera un nuevo objeto con valores por defecto para el formulario
 */
export function makeOperacionDefaults(): Operacion {
  return {
    id: 0,
    numero_documento: '',
    ruc_proveedor: '',
    nombre_proveedor: '',
    tipo_operacion: '',
    fecha: new Date().toISOString().split('T')[0],
    descripcion: '',
    costo_total: '',
    combustibles: [],
    mantenimientos: [],
    servicios: [],
  };
}