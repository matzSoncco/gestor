<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
    <n-card
      class="w-full max-w-md shadow-xl border border-gray-200 transition-all duration-300"
      header-style="text-align: center"
    >
      <template #header>
        <div>
          <h1 class="text-2xl font-bold text-gray-800">Bienvenido de nuevo</h1>
          <p class="text-sm text-gray-500">Ingresa tus credenciales para continuar</p>
        </div>
      </template>

      <form @submit.prevent="handleLogin" class="mt-4">
        <div class="space-y-4">
          <n-input
            v-model:value="username"
            placeholder="Usuario"
            size="large"
            :status="error ? 'error' : undefined"
            :disabled="loading"
            clearable
          >
            <template #prefix>
              <n-icon><UserIcon /></n-icon>
            </template>
          </n-input>

          <n-input
            v-model:value="password"
            type="password"
            placeholder="Contraseña"
            size="large"
            :status="error ? 'error' : undefined"
            :disabled="loading"
            show-password-on="mousedown"
            clearable
          >
            <template #prefix>
              <n-icon><LockIcon /></n-icon>
            </template>
          </n-input>

          <n-button
            type="primary"
            size="large"
            block
            :loading="loading"
            :disabled="!username || !password"
            attr-type="submit"
          >
            <template #icon>
              <n-icon><LoginIcon /></n-icon>
            </template>
            Ingresar
          </n-button>
        </div>
      </form>
    </n-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { NInput, NButton, NCard, NIcon } from 'naive-ui'
import { Lock as LockIcon, User as UserIcon, LogIn as LoginIcon } from 'lucide-vue-next'
import { useAuthStore } from '@/stores/auth'
import { useNotify } from '@/composables/global/useNotify'

const username = ref('')
const password = ref('')
const loading = ref(false)
const error = ref(false)

const router = useRouter()
const auth = useAuthStore()
const { error: notifyError, success: notifySuccess } = useNotify()

const handleLogin = async () => {
  error.value = false

  if (!username.value.trim() || !password.value.trim()) {
    error.value = true
    notifyError('Debes llenar todos los campos', 'Campos vacíos')
    return
  }

  const result = await auth.login(username.value, password.value)
  
  if (result.success) {
    notifySuccess('Sesión iniciada correctamente')
    router.push('/')
  } else {
    error.value = true
    notifyError('Credenciales incorrectas. Intenta nuevamente.', 'Error de autenticación')
  }
}
</script>