<template>
  <div class="min-h-screen bg-white p-6 md:p-8">
    <div class="max-w-7xl mx-auto space-y-8">

      <!-- Encabezado de bienvenida -->
      <div>
        <h1 class="text-3xl font-bold text-gray-800">Bienvenido, {{ usuarioNombre }}</h1>
        <p class="text-gray-600 mt-1 text-base">
          Este es el panel de control principal del sistema. Desde aquí puedes acceder a las funciones más importantes.
        </p>
      </div>

      <!-- Tarjetas de acciones -->
      <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <!-- Operaciones -->
        <n-card
          hoverable
          title="Registrar Operaciones"
          @click="goTo('IngresoDatos')"
          class="cursor-pointer transition-all duration-200 hover:shadow-md group"
        >

          <div class="text-gray-600 text-sm">
            Ingresa nuevas operaciones al sistema de forma rápida y sencilla.
          </div>

          <template #footer>
            <div class="text-sm text-blue-600 group-hover:text-blue-700 transition">
              Ir al formulario de registro →
            </div>
          </template>
        </n-card>

        <!-- Vehículos -->
        <n-card
          hoverable
          title="Registrar Vehículos"
          @click="goTo('RegistroVehiculos')"
          class="cursor-pointer transition-all duration-200 hover:shadow-md group"
        >

          <div class="text-gray-600 text-sm">
            Agrega nuevos vehículos a la base de datos del sistema.
          </div>

          <template #footer>
            <div class="text-sm text-green-600 group-hover:text-green-700 transition">
              Ir al formulario de registro →
            </div>
          </template>
        </n-card>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { NCard } from 'naive-ui'
import { useAuthStore } from '@/store/auth'

const router = useRouter()
const authStore = useAuthStore()
const usuarioNombre = authStore.currentUser?.email || 'Usuario'

const goTo = (ruta) => {
  router.push({ name: ruta })
}
</script>