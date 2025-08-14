export type FieldNameMap = Record<string, string>;

// Campos comunes del formulario de operación (cabecera)
export const FIELD_NAMES_BASE: FieldNameMap = {
  numero_documento: "número de documento",
  ruc_proveedor: "RUC del proveedor",
  nombre_proveedor: "nombre del proveedor",
  tipo_operacion: "tipo de operación",
  fecha: "fecha",
  placa_vehiculo: "vehículo", // por si backend usa FK 'placa_vehiculo'
  non_field_errors: "el formulario",

  // genéricos que pueden aparecer en cualquier tipo
  descripcion: "descripción",
  costo_total: "costo total",
};

// Combustible
export const FIELD_NAMES_COMBUSTIBLE: FieldNameMap = {
  combustible_detalle: "detalle del combustible",
  cantidad_galones: "cantidadde de galones",
  costo_por_galon: "precio por galón",
  ubicacion: "ubicación",
};

// Mantenimiento
export const FIELD_NAMES_MANTENIMIENTO: FieldNameMap = {
  mantenimiento_detalle: "detalle del mantenimiento",
  repuesto: "repuesto",
  cantidad: "cantidad",
  costo_unitario: "costo unitario",
};

// Servicio
export const FIELD_NAMES_SERVICIO: FieldNameMap = {
  servicio_detalle: "detalle del servicio",
  descripcion_item: "descripción del servicio",
  subtotal: "subtotal",
};

// Helper
export function mergeFieldNames(...maps: FieldNameMap[]): FieldNameMap {
  return Object.assign({}, ...maps);
}