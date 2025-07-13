import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/store/auth'

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
      { path: '',               name: 'Home',             component: HomeView,           meta: { requiresAuth: false } },
      { path: 'ingreso-datos',  name: 'IngresoDatos',     component: IngresoDatosView,   meta: { requiresAuth: false } },
      { path: 'reportes',       name: 'Reportes',         component: ReportesView,       meta: { requiresAuth: false } },
      { path: 'registro-vehiculos', name: 'RegistroVehiculos', component: RegistroVehiView, meta: { requiresAuth: false } },
      { path: 'operaciones',         name: 'OpView',        component: OpView },
      { path: 'operaciones/:id',     name: 'OpDetails',     component: OpDetails,         props: true },
      { path: 'vehiculo/new',        name: 'VehiculoNew',   component: FormularioVehiculo },
      { path: 'vehiculos',           name: 'Vehiculos',     component: VehiculosView },
      { path: 'vehiculos/:id',       name: 'VehiculoDetails', component: VehiculoDetails },
      { path: 'vehiculos/:id/edit',  name: 'VehiculoEdit',  component: RegistroVehiView }
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