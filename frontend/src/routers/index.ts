import { createRouter, createWebHistory } from 'vue-router'
import { useAppLoading } from '@/composables/global/useAppLoading'
import { useAuthStore } from '@/stores/auth'

// ✅ Lazy loaded components
const DefaultLayout      = () => import('@/layouts/DefaultLayout.vue')
const HomeView           = () => import('@/views/Home.vue')
const LoginView          = () => import('@/views/Login.vue')
const IngresoDatosView   = () => import('@/views/IngresoDatos.vue')
const OpView             = () => import('@/views/Operacion.vue')
const OpDetails          = () => import('@/components/operaciones/OperacionDetails.vue')
const ReportesView       = () => import('@/views/Reportes.vue')
const RegistroVehiView   = () => import('@/views/RegistroVehiculo.vue')
const FormularioVehiculo = () => import('@/components/vehiculos/FormularioVehiculo.vue')
const VehiculosView      = () => import('@/views/Vehiculos.vue')
const VehiculoDetails    = () => import('@/components/vehiculos/VehiculoDetails.vue')

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: LoginView,
    meta: { requiresAuth: false }
  },
  {
    path: '/',
    component: DefaultLayout,
    children: [
      { path: '', name: 'Home', component: HomeView, meta: { requiresAuth: true } },
      { path: 'ingreso-datos', name: 'IngresoDatos', component: IngresoDatosView, meta: { requiresAuth: true } },
      { path: 'reportes', name: 'Reportes', component: ReportesView, meta: { requiresAuth: true } },
      { path: 'registro-vehiculos', name: 'RegistroVehiculos', component: RegistroVehiView, meta: { requiresAuth: true } },
      { path: 'operaciones', name: 'OpView', component: OpView, meta: { requiresAuth: true } },
      { path: 'operaciones/:id', name: 'OpDetails', component: OpDetails, meta: { requiresAuth: true }, props: true },
      { path: 'vehiculo/new', name: 'VehiculoNew', component: FormularioVehiculo },
      { path: 'vehiculos', name: 'Vehiculos', component: VehiculosView, meta: { requiresAuth: true } },
      { path: 'vehiculos/:id', name: 'VehiculoDetails', component: VehiculoDetails, meta: { requiresAuth: true } },
      { path: 'vehiculos/:id/edit', name: 'VehiculoEdit', component: RegistroVehiView, meta: { requiresAuth: true } }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()
  const { startLoading, shouldShowLoader } = useAppLoading()

  if (shouldShowLoader()) {
    startLoading()
  }

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
  setTimeout(() => stopLoading(), 300)
})

export default router