import { defineStore } from 'pinia'
import { logout } from '@/api/logout'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    isAuthenticated: false,
    user: null as any,
    token: null as string | null,
  }),

  actions: {
    async login(userData: any, token: string) {
      this.user = userData
      this.token = token
      this.isAuthenticated = true
      localStorage.setItem('accessToken', token)
    },

    async initialize() {
      const token = localStorage.getItem('accessToken')
      if (token) {
        this.token = token
        this.isAuthenticated = true
        // Puedes usar una API tipo /me para traer datos reales del usuario
        this.user = { username: 'UsuarioAutenticado' } // dummy temporal
      }
    },

    async logout() {
      try {
        await logout()
      } catch (error) {
        console.error('Error en logout:', error)
      } finally {
        this.user = null
        this.token = null
        this.isAuthenticated = false
        localStorage.removeItem('accessToken')
      }
    }
  }
})