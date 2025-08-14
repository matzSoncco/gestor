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

// Vehículo
export const FIELD_NAMES_VEHICULO: FieldNameMap = {
  placa: "placa",
  anio: "año",
  kilometraje: "kilometraje",
  costo: "costo",
  ubicacion: "ubicación",
  categoria: "categoría",
  marca: "marca",
  modelo: "modelo",
  version: "versión",
  color: "color",
  anio_fabricacion: "año de fabricación",
  anio_modelo: "año de modelo",
  motor: "motor",
  combustible: "combustible",
  forma_rodante: "forma rodante",
  vin: "VIN",
  serie_chasis: "serie de chasis",
  ejes: "número de ejes",
  ruedas: "número de ruedas",
  pasajeros: "número de pasajeros",
  carroceria: "carrocería",
  peso_neto: "peso neto",
  peso_bruto: "peso bruto",
  carga_util: "carga útil",
  cilindrada: "cilindrada",
  cilindros: "cilindros",
  altura: "altura",
  ancho: "ancho",
  longitud: "longitud",
  necesita_mantenimiento: "necesita mantenimiento",
  siguiente_hito_mantenimiento: "siguiente hito de mantenimiento",
  proximo_hito_mantenimiento: "próximo hito de mantenimiento",
  non_field_errors: "el formulario",
};

// Helper
export function mergeFieldNames(...maps: FieldNameMap[]): FieldNameMap {
  return Object.assign({}, ...maps);
}