// stores/auth.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import apiService from '@/services/api'
import router from '@/routers'

/* ---------- Tipos auxiliares ---------- */
export interface LoginCredentials {
  username: string
  password: string
}

export interface AuthResponse {
  access: string
  refresh?: string
}

export interface User {
  /** Puedes ampliarlo cuando tu API devuelva más campos */
  username: string
  [key: string]: unknown
}

/* ---------- Helper ---------- */
function safeJsonParse<T>(val: string | null): T | null {
  try { return val ? (JSON.parse(val) as T) : null }
  catch { return null }
}

/* ---------- Store ---------- */
export const useAuthStore = defineStore('auth', () => {
  /* state (reactive) */
  const token       = ref<string | null>(localStorage.getItem('authToken'))
  const user        = ref<User  | null>(safeJsonParse<User>(localStorage.getItem('authUser')))
  const loginError  = ref<string | null>(null)

  /* getters */
  const isAuthenticated = computed(() => !!token.value)
  const currentUser     = computed(() => user.value)

  /* actions */
  async function login (credentials: LoginCredentials) {
    loginError.value = null
    try {
      // auth.ts (store)
      const { data } = await apiService.post<AuthResponse>('/auth/login/', credentials)

      token.value = data.access
      localStorage.setItem('authToken', data.access)
      if (data.refresh) localStorage.setItem('authRefreshToken', data.refresh)

      // Ejemplo: al no tener endpoint de perfil real, simulamos usuario
      user.value = { username: credentials.username }
      localStorage.setItem('authUser', JSON.stringify(user.value))

      router.push({ name: 'Home' })
    } catch (err: any) {
      console.error('Error de login:', err.response?.data || err.message)
      loginError.value =
        err.response?.data?.detail ||
        'Error al iniciar sesión. Verifique sus credenciales.'

      // Limpiamos todo
      token.value = null
      user.value = null
      localStorage.removeItem('authToken')
      localStorage.removeItem('authUser')
      localStorage.removeItem('authRefreshToken')
    }
  }

  function logout () {
    token.value = null
    user.value  = null
    localStorage.removeItem('authToken')
    localStorage.removeItem('authUser')
    localStorage.removeItem('authRefreshToken')
    router.push({ name: 'Login' })
  }

  /** Si requieres inicialización extra en main.ts */
  function initializeAuth () {
    token.value = localStorage.getItem('authToken')
    user.value  = safeJsonParse<User>(localStorage.getItem('authUser'))
  }

  return {
    /* state */
    token,
    user,
    loginError,
    /* getters */
    isAuthenticated,
    currentUser,
    /* actions */
    login,
    logout,
    initializeAuth
  }
})