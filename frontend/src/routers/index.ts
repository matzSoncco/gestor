import { createRouter, createWebHistory } from 'vue-router'
import { useAppLoading } from '@/composables/global/useAppLoading'
import { useAuthStore } from '@/stores/auth'

import DefaultLayout      from '@/layouts/DefaultLayout.vue'
import HomeView           from '@/views/Home.vue'
import LoginView          from '@/views/Login.vue'
import IngresoDatosView   from '@/views/IngresoDatos.vue'
import OpView             from '@/views/Operacion.vue'
import OpDetails          from '@/components/operaciones/OperacionDetails.vue'
import ReportesView       from '@/views/Reportes.vue'
import RegistroVehiView   from '@/views/RegistroVehiculo.vue'
import FormularioVehiculo from '@/components/vehiculos/FormularioVehiculo.vue'
import VehiculosView      from '@/views/Vehiculos.vue'
import VehiculoDetails    from '@/components/vehiculos/VehiculoDetails.vue'

const routes = [
  { path: '/login',
    name: 'Login',
    component: LoginView,
    meta: { requiresAuth: false }
  },

  {
    path: '/',
    component: DefaultLayout,
    children: [
      { path: '',               name: 'Home',             component: HomeView,           meta: { requiresAuth: true } },
      { path: 'ingreso-datos',  name: 'IngresoDatos',     component: IngresoDatosView,   meta: { requiresAuth: true } },
      { path: 'reportes',       name: 'Reportes',         component: ReportesView,       meta: { requiresAuth: true } },
      { path: 'registro-vehiculos', name: 'RegistroVehiculos', component: RegistroVehiView, meta: { requiresAuth: true } },
      { path: 'operaciones',         name: 'OpView',        component: OpView, meta: { requiresAuth: true }},
      { path: 'operaciones/:id',     name: 'OpDetails',     component: OpDetails, meta: { requiresAuth: true }, props: true },
      { path: 'vehiculo/new',        name: 'VehiculoNew',   component: FormularioVehiculo },
      { path: 'vehiculos',           name: 'Vehiculos',     component: VehiculosView, meta: { requiresAuth: true } },
      { path: 'vehiculos/:id',       name: 'VehiculoDetails', component: VehiculoDetails, meta: { requiresAuth: true } },
      { path: 'vehiculos/:id/edit',  name: 'VehiculoEdit',  component: RegistroVehiView, meta: { requiresAuth: true } }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()
  const { startLoading, stopLoading } = useAppLoading()

  startLoading() // <- inicia loader al cambiar ruta

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/login')
  } else if (to.name === 'Login' && authStore.isAuthenticated) {
    next('/')
  } else {
    next()
  }
})

router.afterEach(() => {
  const { stopLoading } = useAppLoading()
  setTimeout(() => stopLoading(), 300) // retrasa levemente para una UX más fluida
})
export default router