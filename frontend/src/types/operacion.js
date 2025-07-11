/**
 * @typedef {Object} Operacion
 * @property {string} numero_documento
 * @property {string} ruc_proveedor
 * @property {string} nombre_proveedor
 * @property {'combustible'|'mantenimiento'|'servicio'|''} tipo_operacion
 * @property {string} fecha             // ISO yyyy-mm-dd
 * @property {string} descripcion
 * @property {number} costo_total
 * @property {Array<Object>} combustibles
 * @property {Array<Object>} mantenimientos
 * @property {Array<Object>} servicios
 */

/**
 * Genera un nuevo objeto con valores por defecto para el formulario
 * (evita compartir la misma referencia de arrays entre instancias).
 * @returns {Operacion}
 */
export function makeOperacionDefaults () {
  return {
    numero_documento : '',
    ruc_proveedor    : '',
    nombre_proveedor : '',
    tipo_operacion   : '',
    fecha            : '',
    descripcion      : '',
    costo_total      : 0,
    combustibles     : [],
    mantenimientos   : [],
    servicios        : [],
  };
}
