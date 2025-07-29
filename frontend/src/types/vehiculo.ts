export interface Vehiculo {
  id: number;
  placa: string;
  anio: number;
  kilometraje: number | null;
  costo: number;
  ubicacion: string;
  categoria: string;
  marca: string;
  modelo: string;
  version: string;
  color: string;
  anio_fabricacion: number;
  anio_modelo: number;
  motor: string;
  combustible: string;
  forma_rodante: string;
  vin: string;
  serie_chasis: string;
  ejes: number;
  ruedas: number;
  pasajeros: number;
  carroceria: string;
  peso_neto: number;
  peso_bruto: number;
  carga_util: number;
  cilindrada: number;
  cilindros: number;
  altura: number;
  ancho: number;
  longitud: number;
  necesita_mantenimiento: boolean // (bool real del modelo)
  siguiente_hito_mantenimiento: number // <-- Calculado
  proximo_hito_mantenimiento: number // <-- Calculado
}

export interface MantenimientoResponse {
  detail: string
  vehiculo: Vehiculo
}
/**
 * Devuelve un objeto nuevo con los valores por defecto de un vehículo
 */
export function makeVehiculoDefaults(): Vehiculo {
  return {
    id: 0,
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
    necesita_mantenimiento: false,
    siguiente_hito_mantenimiento: 0,
    proximo_hito_mantenimiento: 0
  };
}