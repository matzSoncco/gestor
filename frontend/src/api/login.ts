// src/api/login.ts
import api from '@/services/authService';
import axios, { AxiosError } from 'axios';

export type LoginResponse =
  | { success: true; access: string; refresh: string }
  | { success: false; error: string };

export async function login(username: string, password: string): Promise<LoginResponse> {
  try {
    const { data } = await api.post('/token/', { username, password });
    return {
      success: true,
      access: data.access,
      refresh: data.refresh,
    };
  } catch (err) {
    if (axios.isAxiosError(err)) {
      if (err.code === 'ECONNABORTED' || !err.response) {
        return { success: false, error: 'El servidor está despertando o sin conexión. Inténtalo de nuevo en unos segundos.' };
      }
      if (err.response?.status === 401) {
        return { success: false, error: 'Credenciales incorrectas. Verifica usuario y contraseña.' };
      }
      //otros errores 5xx / 4xx
      return { success: false, error: 'Error inesperado del servidor. Intenta nuevamente más tarde.' };
    }
    return { success: false, error: 'Error desconocido. Revisa tu conexión.' };
  }
}