import api from '@/services/authService'

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
    console.error('Error al iniciar sesión', error)
    return { success: false, error } as const
  }
}