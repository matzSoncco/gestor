import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../store/auth' // Importar el store

import HomeView from '../views/Home.vue'
import LoginView from '../views/Login.vue'

import IngresoDatosView from '../views/IngresoDatos.vue'
import OpView from '../views/Operacion.vue'
import OpDetails from '../components/operaciones/OperacionDetails.vue'

import ReportesView from '../views/Reportes.vue'

import FormularioVehiculo from '../components/vehiculos/FormularioVehiculo.vue'
import VehiculosView from '../views/Vehiculos.vue'
import VehiculoDetails from '../components/vehiculos/VehiculoDetails.vue'
import RegistroVehiView from '../views/RegistroVehiculo.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomeView,
    meta: { requiresAuth: false }, // Proteger esta ruta
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
    meta: { requiresAuth: false },
  },
  {
    path: '/reportes',
    name: 'Reportes',
    component: ReportesView,
    meta: { requiresAuth: false },
  },
  {
    path: '/registro-vehiculos',
    name: 'RegistroVehiculos',
    component: RegistroVehiView,
    meta: { requiresAuth: false }, //cambiar luego a true si se requiere autenticación
  },
  {
    path: '/operaciones',
    name: 'OpView',
    component: OpView
  },
  {
    path: '/operaciones/:id',
    name: 'OpDetails',
    component: OpDetails,
    props: true
  },
  {
    path: '/vehiculo/new',
    name: 'VehiculoNew',
    component: FormularioVehiculo,
  },
  {
    path: '/vehiculos',
    name: 'Vehiculos',
    component: VehiculosView
  },
  {
    path: '/vehiculos/:id',
    name: 'VehiculoDetails',
    component: VehiculoDetails
  },
  {
    path: '/vehiculos/:id/edit',
    name: 'VehiculoEdit',
    component: RegistroVehiView
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