import { defineStore } from 'pinia'
import type { Operacion } from '@/types/operacion'
import { fetchOperaciones } from '@/api/operaciones'

export const useOperacionStore = defineStore('operacion', {
  state: () => ({
    operaciones: [] as Operacion[],
    count: 0,
    next: null as string | null,
    previous: null as string | null
  }),
  actions: {
    async fetchOperaciones(params?: Record<string, any>) {
      const data = await fetchOperaciones(params)
      this.operaciones = data.results
      this.count = data.count
      this.next = data.next
      this.previous = data.previous
    },
    setOperaciones(data: Operacion[]) {
      this.operaciones = data
    },
    agregarOperacion(nueva: Operacion) {
      this.operaciones.unshift(nueva)
      this.count += 1
    },
    actualizarOperacion(actualizada: Operacion) {
      const index = this.operaciones.findIndex(op => op.id === (actualizada.id ?? -1))
      if (index !== -1) {
        this.operaciones[index] = { ...this.operaciones[index], ...actualizada }
      }
    },
    eliminarOperacion(id: number) {
      this.operaciones = this.operaciones.filter(op => op.id !== id)
      this.count -= 1
    }
  }
})