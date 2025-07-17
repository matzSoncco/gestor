import { defineStore } from 'pinia'
import { logout } from '@/api/logout'
import router from '@/routers'

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
    },

    async initialize() {
      // Con persistencia automática, no necesitas recuperar manualmente
      if (this.token) {
        this.isAuthenticated = true
        this.user = { username: 'UsuarioAutenticado' } // dummy hasta que uses /me
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
        router.push('/login')
      }
    }
  },
  persist: true
})