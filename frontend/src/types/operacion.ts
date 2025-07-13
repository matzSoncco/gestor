// Puedes importar estos tipos si luego defines estructuras específicas
// import { Combustible } from './combustible';
// import { Mantenimiento } from './mantenimiento';
// import { Servicio } from './servicio';

export type TipoOperacion = 'combustible' | 'mantenimiento' | 'servicio' | '';

export interface Operacion {
  numero_documento: string;
  ruc_proveedor: string;
  nombre_proveedor: string;
  tipo_operacion: TipoOperacion;
  fecha: string; // ISO string (yyyy-mm-dd)
  descripcion: string;
  costo_total: number;

  combustibles: any[];     // Idealmente: Combustible[]
  mantenimientos: any[];   // Idealmente: Mantenimiento[]
  servicios: any[];        // Idealmente: Servicio[]
}

/**
 * Genera un nuevo objeto con valores por defecto para el formulario
 */
export function makeOperacionDefaults(): Operacion {
  return {
    numero_documento : '',
    ruc_proveedor    : '',
    nombre_proveedor : '',
    tipo_operacion   : '',
    fecha            : new Date().toISOString().split('T')[0], // ← aquí está el fix
    descripcion      : '',
    costo_total      : 0,
    combustibles     : [],
    mantenimientos   : [],
    servicios        : [],
  };
}