<!-- <template>
  <div class="space-y-6">
    <div>
      <h1 class="text-2xl font-bold text-gray-800">Bienvenido, {{ usuarioNombre }}</h1>
      <p class="text-gray-600">Este es el panel de control principal del sistema.</p>
    </div>

    <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <n-card title="Registrar Operaciones" hoverable @click="goTo('IngresoDatos')" class="cursor-pointer">
        <template #footer>Ir a formulario de operaciones</template>
      </n-card>

      <n-card title="Vehículos" hoverable @click="goTo('Vehiculos')" class="cursor-pointer">
        <template #footer>Ver vehículos registrados</template>
      </n-card>

      <n-card title="Reportes" hoverable @click="goTo('Reportes')" class="cursor-pointer">
        <template #footer>Generar reportes</template>
      </n-card>
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
</script> -->
<template>
  <div class="flex flex-col items-center justify-center h-full text-center px-4 py-20">
    <h1 class="text-3xl font-bold text-gray-800 mb-4">🚧 Página de Inicio en Construcción</h1>
    <p class="text-gray-600 text-lg">
      Estamos trabajando en esta sección. Mientras tanto, puedes usar el menú lateral para acceder a otras funciones del sistema.
    </p>
  </div>
</template>

<script setup>
// No se necesita lógica por ahora
</script>
