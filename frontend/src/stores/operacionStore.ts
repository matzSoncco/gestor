import { defineStore } from 'pinia'
import type { Operacion } from '@/types/operacion'

export const useOperacionStore = defineStore('operacion', {
  state: () => ({
    operaciones: [] as Operacion[],
  }),
  actions: {
    setOperaciones(data: Operacion[]) {
      this.operaciones = data
    },
    agregarOperacion(nueva: Operacion) {
      this.operaciones.unshift(nueva)
    },
    actualizarOperacion(actualizada: Operacion) {
      const index = this.operaciones.findIndex(op => op.id === (actualizada.id ?? -1))
      if (index !== -1) {
        this.operaciones[index] = { ...this.operaciones[index], ...actualizada }
      }
    },
    eliminarOperacion(id: number) {
      this.operaciones = this.operaciones.filter(op => op.id !== id)
    },
  },
})