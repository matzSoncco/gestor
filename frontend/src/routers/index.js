import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../store/auth' // Importar el store

import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue'
import IngresoDatosView from '../views/IngresoDatosView.vue'
import ReportesView from '../views/ReportesView.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomeView,
    meta: { requiresAuth: true }, // Proteger esta ruta
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginView,
  },
  {
    path: '/ingreso-datos',
    name: 'IngresoDatos',
    component: IngresoDatosView,
    meta: { requiresAuth: true },
  },
  {
    path: '/reportes',
    name: 'Reportes',
    component: ReportesView,
    meta: { requiresAuth: true },
  },
  // Puedes añadir una ruta catch-all para 404 si quieres
  // { path: '/:pathMatch(.*)*', name: 'NotFound', component: () => import('../views/NotFoundView.vue') }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

// Navigation Guard
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  // authStore.initializeAuth(); // Asegurarse que el estado esté cargado, aunque Pinia lo hace bien con localStorage

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next({ name: 'Login' }); // Redirigir a Login si la ruta requiere autenticación y no está logueado
  } else if (to.name === 'Login' && authStore.isAuthenticated) {
    next({ name: 'Home' }); // Si ya está logueado e intenta ir a Login, redirigir a Home
  }
  else {
    next(); // Continuar la navegación
  }
})

export default router