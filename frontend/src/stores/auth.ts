import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { getCurrentUser } from '@/api/user'
import { login as loginAPI } from '@/api/login'

interface Empresa {
  id: number
  ruc: string
  razon_social: string
}

interface User {
  id?: number
  username: string
  email?: string
  role?: string
  empresa?: Empresa
  first_name?: string
  last_name?: string
}

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref<User | null>(null)
  const accessToken = ref<string | null>(null)
  const refreshToken = ref<string | null>(null)
  const isLoading = ref(false)

  // Getters
  const isAuthenticated = computed(() => !!accessToken.value && !!user.value)

  const empresa = computed(() => user.value?.empresa ?? null)

  // Actions
  const login = async (username: string, password: string) => {
    try {
      isLoading.value = true

      const loginResult = await loginAPI(username, password)

      if (loginResult.success) {
        accessToken.value = loginResult.access
        refreshToken.value = loginResult.refresh

        localStorage.setItem('accessToken', loginResult.access)
        localStorage.setItem('refreshToken', loginResult.refresh)

        const userResult = await getCurrentUser()
        if (userResult.success) {
          user.value = userResult.user
          localStorage.setItem('user', JSON.stringify(userResult.user))
        } else {
          throw new Error('No se pudo obtener información del usuario.')
        }

        return { success: true }
      } else {
        throw new Error('Login fallido')
      }
    } catch (error) {
      console.error('Error al iniciar sesión:', error)
      return { success: false, error }
    } finally {
      isLoading.value = false
    }
  }

  const logout = (router?: ReturnType<typeof useRouter>) => {
    user.value = null
    accessToken.value = null
    refreshToken.value = null

    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('user')

    if (router) {
      router.push('/login')
    }
  }

  const checkTokenValidity = (): boolean => {
    if (!accessToken.value) return false

    try {
      const payload = JSON.parse(atob(accessToken.value.split('.')[1]))
      const currentTime = Date.now() / 1000

      return !payload.exp || payload.exp >= currentTime
    } catch (error) {
      console.warn('Token inválido o corrupto')
      return false
    }
  }

  const initializeAuth = () => {
    try {
      const storedToken = localStorage.getItem('accessToken')
      const storedRefreshToken = localStorage.getItem('refreshToken')
      const storedUser = localStorage.getItem('user')

      if (storedToken && storedUser) {
        accessToken.value = storedToken
        refreshToken.value = storedRefreshToken
        user.value = JSON.parse(storedUser)

        if (!checkTokenValidity()) {
          logout()
        }
      }
    } catch (error) {
      console.error('Error al cargar datos guardados:', error)
      logout()
    }
  }

  // Inicialización automática en cliente
  if (typeof window !== 'undefined') {
    initializeAuth()
  }

  return {
    // State
    user,
    accessToken,
    refreshToken,
    isLoading,

    // Getters
    isAuthenticated,
    empresa,

    // Actions
    login,
    logout,
    initializeAuth,
    checkTokenValidity
  }
}, {
  persist: true
})