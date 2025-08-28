// src/stores/auth.ts
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { getCurrentUser } from '@/api/user';
import { login as loginAPI } from '@/api/login';

interface Empresa {
  id: number;
  ruc: string;
  razon_social: string;
}

interface User {
  id?: number;
  username: string;
  email?: string;
  role?: string;
  empresa?: Empresa;
  first_name?: string;
  last_name?: string;
}

type LoginResult =
  | { success: true }
  | { success: false; error: string };

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref<User | null>(null);
  const accessToken = ref<string | null>(null);
  const refreshToken = ref<string | null>(null);
  const isLoading = ref(false);

  // Getters
  const isAuthenticated = computed(() => !!accessToken.value && !!user.value);
  const empresa = computed(() => user.value?.empresa ?? null);

  // Actions
  const login = async (username: string, password: string): Promise<LoginResult> => {
    isLoading.value = true;
    try {
      const loginResult = await loginAPI(username, password);

      if (!loginResult.success) {
        return { success: false, error: loginResult.error };
      }

      accessToken.value = loginResult.access;
      refreshToken.value = loginResult.refresh;

      localStorage.setItem('accessToken', loginResult.access);
      localStorage.setItem('refreshToken', loginResult.refresh);

      const userResult = await getCurrentUser();
      if (userResult.success) {
        user.value = userResult.user;
        localStorage.setItem('user', JSON.stringify(userResult.user));
      } else {
        logout();
        return { success: false, error: 'No se pudo obtener información del usuario.' };
      }

      return { success: true };
    } catch {
      return { success: false, error: 'Hubo un problema al iniciar sesión. Intenta de nuevo.' };
    } finally {
      isLoading.value = false;
    }
  };

  const logout = (router?: ReturnType<typeof useRouter>) => {
    user.value = null;
    accessToken.value = null;
    refreshToken.value = null;

    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');

    if (router) {
      router.push('/login');
    }
  };

  const checkTokenValidity = (): boolean => {
    if (!accessToken.value) return false;
    try {
      const payload = JSON.parse(atob(accessToken.value.split('.')[1]));
      const currentTime = Date.now() / 1000;
      return !payload.exp || payload.exp >= currentTime;
    } catch {
      return false;
    }
  };

  const initializeAuth = () => {
    try {
      const storedToken = localStorage.getItem('accessToken');
      const storedRefreshToken = localStorage.getItem('refreshToken');
      const storedUser = localStorage.getItem('user');

      if (storedToken && storedUser) {
        accessToken.value = storedToken;
        refreshToken.value = storedRefreshToken;
        user.value = JSON.parse(storedUser);

        if (!checkTokenValidity()) {
          logout();
        }
      }
    } catch {
      logout();
    }
  };

  if (typeof window !== 'undefined') {
    initializeAuth();
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
    checkTokenValidity,
  };
}, {
  persist: true,
});