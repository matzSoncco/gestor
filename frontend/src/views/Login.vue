<template>
  <div
    class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-100 px-4 py-8 relative overflow-hidden"
  >
    <!-- Fondos animados -->
    <div class="absolute top-0 left-0 w-full h-full pointer-events-none">
      <div
        class="absolute w-64 h-64 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob top-10 left-1/4"
      ></div>
      <div
        class="absolute w-64 h-64 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000 top-1/2 right-1/4"
      ></div>
      <div
        class="absolute w-64 h-64 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000 bottom-10 left-1/3"
      ></div>
    </div>

    <!-- Tarjeta login -->
    <n-card
      class="w-full max-w-md shadow-2xl border border-gray-200 transform transition-all duration-500 ease-in-out-back relative z-10"
      :class="{ 'scale-95 opacity-80': auth.isLoading }"
      header-style="text-align: center"
      content-style="padding-bottom: 2rem;"
    >
      <template #header>
        <div class="py-4">
          <h1 class="text-3xl font-extrabold text-gray-800 tracking-tight">
            ¡Hola de nuevo! 👋
          </h1>
          <p class="text-md text-gray-500 mt-1">
            Ingresa tus credenciales para acceder
          </p>
        </div>
      </template>

      <form @submit.prevent="handleLogin" class="mt-4">
        <div class="space-y-6">
          <n-input
            v-model:value="username"
            placeholder="Nombre de usuario"
            size="large"
            :status="showError && !username.trim() ? 'error' : undefined"
            :disabled="auth.isLoading"
            clearable
            round
            autofocus
            @focus="clearError"
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
            :status="showError && !password.trim() ? 'error' : undefined"
            :disabled="auth.isLoading"
            show-password-on="mousedown"
            clearable
            round
            @focus="clearError"
            @keyup.enter="handleLogin"
          >
            <template #prefix>
              <n-icon><LockIcon /></n-icon>
            </template>
          </n-input>

          <n-button
            type="primary"
            size="large"
            block
            :loading="auth.isLoading"
            :disabled="!username.trim() || !password.trim()"
            attr-type="submit"
            strong
            round
            class="transition-all duration-300 ease-out transform hover:scale-105"
          >
            <template #icon>
              <n-icon><LoginIcon /></n-icon>
            </template>
            {{ auth.isLoading ? 'Iniciando sesión...' : 'Ingresar' }}
          </n-button>
        </div>
      </form>
    </n-card>

    <!-- Overlay mientras valida credenciales -->
    <Transition name="fade">
      <div
        v-if="auth.isLoading"
        class="absolute inset-0 bg-white bg-opacity-70 flex items-center justify-center z-20 transition-opacity duration-300"
      >
        <div class="flex flex-col items-center">
          <div
            class="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12 mb-4"
          ></div>
          <p class="text-lg text-gray-700 font-semibold">
            Validando credenciales...
          </p>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { NInput, NButton, NCard, NIcon } from "naive-ui";
import {
  Lock as LockIcon,
  User as UserIcon,
  LogIn as LoginIcon,
} from "lucide-vue-next";
import { useAuthStore } from "@/stores/auth";
import { useNotify } from "@/composables/global/useNotify";
import { useAppLoading } from "@/composables/global/useAppLoading";

const username = ref("");
const password = ref("");
const showError = ref(false);

const router = useRouter();
const auth = useAuthStore();
const { error: notifyError, success: notifySuccess } = useNotify();
const { startLoading, markJustLoggedIn } = useAppLoading();

const clearError = () => {
  showError.value = false;
};

const handleLogin = async () => {
  showError.value = false;

  if (!username.value.trim() || !password.value.trim()) {
    showError.value = true;
    notifyError("Por favor, completa todos los campos.");
    return;
  }

  const result = await auth.login(username.value, password.value);

  if (result.success) {
    notifySuccess("¡Bienvenido! Sesión iniciada correctamente.");
    markJustLoggedIn();
    startLoading();

    setTimeout(() => router.push("/"), 600);
  } else {
    showError.value = true;
    notifyError(result.error || "Error al iniciar sesión.");
  }
};
</script>