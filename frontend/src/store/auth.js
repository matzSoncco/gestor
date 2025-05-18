import { defineStore } from "pinia"
import apiService from '../services/apiService'
import router from '../routers'

export const useAuthStore = defineStore('auth', {
    state: () => ({
        token: localStorage.getItem('authToken') || null,
        user: JSON.parse(localStorage.getItem('authUser')) || null,
        loginError: null,
    }),
    getters: {
        isAuthenticated: (state) => !!state.token,
        currentUser: (state) => state.user,
    },
    actions: {
        async login(credentials) {
            this.loginError = null;
            try {
                const response = await apiService.login(credentials); // Necesitarás crear esta función en apiService
                const token = response.data.access; // Asumiendo que tu API devuelve un token JWT (access y refresh)
                const refreshToken = response.data.refresh; // Opcional

                this.token = token;
                localStorage.setItem('authToken', token);
                if (refreshToken) {
                    localStorage.setItem('authRefreshToken', refreshToken);
                }

                // Opcional: Obtener datos del usuario después del login
                // const userResponse = await apiService.fetchCurrentUser();
                // this.user = userResponse.data;
                // localStorage.setItem('authUser', JSON.stringify(this.user));
                
                // Simulación de datos de usuario por ahora
                this.user = { email: credentials.email };
                localStorage.setItem('authUser', JSON.stringify(this.user));


                router.push({ name: 'Home' }); // Redirigir a Home después del login
            } catch (error) {
                console.error('Error de login:', error.response?.data || error.message);
                this.loginError = error.response?.data?.detail || 'Error al iniciar sesión. Verifique sus credenciales.';
                this.token = null;
                this.user = null;
                localStorage.removeItem('authToken');
                localStorage.removeItem('authUser');
                localStorage.removeItem('authRefreshToken');
            }
        },
        logout() {
            // Opcional: llamar a un endpoint de logout en el backend si es necesario
            // apiService.logout();
            this.token = null;
            this.user = null;
            localStorage.removeItem('authToken');
            localStorage.removeItem('authUser');
            localStorage.removeItem('authRefreshToken');
            router.push({ name: 'Login' });
        },
        // Opcional: Acción para refrescar token
        // async refreshToken() { ... }

        // Acción para inicializar el estado desde localStorage (si no se hace en `state`)
        // útil si necesitas lógica más compleja al cargar
        initializeAuth() {
            const token = localStorage.getItem('authToken');
            const user = localStorage.getItem('authUser');
            if (token && user) {
                this.token = token;
                this.user = JSON.parse(user);
            } else {
                this.token = null;
                this.user = null;
            }
        }
    },
})