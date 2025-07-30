export type TipoOperacion = 'combustible' | 'mantenimiento' | 'servicio' | '';

export interface Combustible {
  id: string;
  cantidad_galones: number;
  costo_por_galon: number;
  subtotal: number;
  igv?: number;
  total?: number;
  ubicacion: string;
  placa_vehiculo?: string;
}

export interface Mantenimiento {
  id: string;
  repuesto: string;
  cantidad: number;
  costo_unitario: number;
  subtotal: number;
  igv?: number;
  total?: number;
  placa_vehiculo?: string;
}

export interface Servicio {
  id: string;
  descripcion_item: string;
  subtotal: number;
  igv?: number;
  total?: number;
  placa_vehiculo?: string;
}

export interface Operacion {
  id: number
  numero_documento: string;
  ruc_proveedor: string;
  nombre_proveedor: string;
  tipo_operacion: TipoOperacion;
  fecha: string;
  descripcion: string;
  costo_total: number;
  combustibles: Combustible[];
  mantenimientos: Mantenimiento[];
  servicios: Servicio[];
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
    costo_total: 0,
    combustibles: [],
    mantenimientos: [],
    servicios: [],
  };
}