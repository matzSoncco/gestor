<!-- views/Login.vue -->
<template>
  <div class="max-w-sm mx-auto mt-20">
    <h1 class="text-xl font-bold mb-4">Iniciar Sesión</h1>
    <form @submit.prevent="handleLogin">
      <input v-model="username" placeholder="Usuario" class="input" />
      <input v-model="password" type="password" placeholder="Contraseña" class="input mt-2" />
      <button type="submit" class="btn mt-4">Ingresar</button>
    </form>
    <p v-if="error" class="text-red-500 mt-2">Credenciales incorrectas</p>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { login } from '@/api/login'
import { useAuthStore } from '@/stores/auth'

const username = ref('')
const password = ref('')
const error = ref(false)
const router = useRouter()
const auth = useAuthStore()

const handleLogin = async () => {
  if (!username.value || !password.value) {
    error.value = true
    return
  }

  const res = await login(username.value, password.value)

  if (res.success) {
    res;
    router.push('/')
  } else {
    error.value = true
  }
}
</script>