import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

interface User {
  id?: number
  username: string
  email?: string
  role?: string
}

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref<User | null>(null)
  const accessToken = ref<string | null>(null)
  const refreshToken = ref<string | null>(null)
  const isLoading = ref(false)

  // Getters
  const isAuthenticated = computed(() => !!accessToken.value && !!user.value)
  
  // Actions
  const login = async (userData: User, token: string) => {
    try {
      isLoading.value = true
      
      user.value = userData
      accessToken.value = token
      refreshToken.value = localStorage.getItem('refreshToken')
      
      // Guardar datos del usuario en localStorage
      localStorage.setItem('user', JSON.stringify(userData))
      
    } catch (error) {
      console.error('Error during login:', error)
      throw error
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

    // Redireccionar
    if (router) {
      router.push('/login')
    }
  }

  // Inicializar desde localStorage
  const initializeAuth = () => {
    const storedToken = localStorage.getItem('accessToken')
    const storedRefreshToken = localStorage.getItem('refreshToken')
    const storedUser = localStorage.getItem('user')
    
    if (storedToken && storedUser) {
      try {
        accessToken.value = storedToken
        refreshToken.value = storedRefreshToken
        user.value = JSON.parse(storedUser)
        
        // Verificar si el token es válido
        if (!checkTokenValidity()) {
          logout()
        }
      } catch (error) {
        console.error('Error parsing stored user data:', error)
        logout() // Limpiar datos corruptos
      }
    }
  }

  // Función para verificar si el token es válido
  const checkTokenValidity = (): boolean => {
    if (!accessToken.value) return false
    
    try {
      // Decodificar el JWT para verificar expiración
      const payload = JSON.parse(atob(accessToken.value.split('.')[1]))
      const currentTime = Date.now() / 1000
      
      if (payload.exp && payload.exp < currentTime) {
        return false
      }
      
      return true
    } catch (error) {
      return false
    }
  }

  // Inicializar automáticamente cuando el store se crea
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
    
    // Actions
    login,
    logout,
    initializeAuth,
    checkTokenValidity
  }
}, {
  persist: true
})