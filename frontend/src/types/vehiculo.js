/**
 * @typedef {Object} Vehiculo
 * @property {string} placa
 * @property {number} anio
 * @property {number} kilometraje
 * @property {number} costo
 * @property {string} ubicacion
 * @property {string} categoria
 * @property {string} marca
 * @property {string} modelo
 * @property {string} version
 * @property {string} color
 * @property {number} anio_fabricacion
 * @property {number} anio_modelo
 * @property {string} motor
 * @property {string} combustible
 * @property {string} forma_rodante
 * @property {string} vin
 * @property {string} serie_chasis
 * @property {number} ejes
 * @property {number} ruedas
 * @property {number} pasajeros
 * @property {string} carroceria
 * @property {number} peso_neto
 * @property {number} peso_bruto
 * @property {number} carga_util
 * @property {number} cilindrada
 * @property {number} cilindros
 * @property {number} altura
 * @property {number} ancho
 * @property {number} longitud
 */

/**
 * Devuelve un objeto nuevo con los valores por defecto de un vehículo
 * @returns {Vehiculo}
 */
export function makeVehiculoDefaults () {
  return {
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
}
