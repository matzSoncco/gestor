import { createRouter, createWebHistory } from 'vue-router'
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
  { path: '/login', name: 'Login', component: LoginView },

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

router.beforeEach((to, _, next) => {
  const auth = useAuthStore()
  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    next({ name: 'Login' })
  } else if (to.name === 'Login' && auth.isAuthenticated) {
    next({ name: 'Home' })
  } else {
    next()
  }
})

export default router