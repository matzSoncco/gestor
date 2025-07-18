import { defineStore } from 'pinia'
import type { Vehiculo } from '@/types/vehiculo'

export const useVehiculoStore = defineStore('vehiculo', {
  state: () => ({
    vehiculos: [] as Vehiculo[],
  }),
  actions: {
    setVehiculos(data: Vehiculo[]) {
      this.vehiculos = data
    },
    actualizarVehiculo(actualizado: Vehiculo) {
      const index = this.vehiculos.findIndex(v => v.id === actualizado.id)
      if (index !== -1) {
        this.vehiculos[index] = { ...this.vehiculos[index], ...actualizado }
      }
    },
  },
})