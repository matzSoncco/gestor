import api from '@/services/authService'
import axios from 'axios';

export type LoginResponse = 
  | { success: true; access: string; refresh: string }
  | { success: false; error: unknown }

export async function login(username: string, password: string): Promise<LoginResponse> {
  try {
    const { data } = await api.post('/token/', { username, password })
    
    return { 
      success: true, 
      access: data.access,
      refresh: data.refresh
    } as const // ← Esto ayuda a TypeScript
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Error al iniciar sesión", {
        status: error.response?.status,
        url: error.config?.url,
        message: error.message
      })
    } else {
      console.error("Error desconocido al iniciar sesión", error)
    }
    return { success: false, error } as const
  }
}