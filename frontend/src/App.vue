<template>
  <n-config-provider>
    <n-notification-provider>
      <!-- Loader con transición -->
      <Transition name="fade" mode="out-in">
        <div
          v-if="auth.isLoading"
          key="loader"
          class="loader-container"
        >
          <div class="loader-content">
            <div class="app-loader"></div>
            <p class="loader-text">
              Cargando aplicación...
            </p>
          </div>
        </div>
      </Transition>

      <!-- Contenido de la app -->
      <router-view v-if="!auth.isLoading" v-slot="{ Component }">
        <Transition name="page" mode="out-in">
          <component :is="Component" />
        </Transition>
      </router-view>
    </n-notification-provider>
  </n-config-provider>
</template>

<script setup lang="ts">
import { useAuthStore } from "@/stores/auth";

const auth = useAuthStore();
</script>

<style scoped>
/* Contenedor del loader */
.loader-container {
  position: fixed;
  inset: 0;
  background-color: rgba(249, 250, 251, 0.9);
  backdrop-filter: blur(2px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.loader-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

/* Spinner animado mejorado */
.app-loader {
  width: 3rem;
  height: 3rem;
  border: 3px solid #e5e7eb;
  border-top-color: #3b82f6;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

.loader-text {
  font-size: 1.125rem;
  color: #374151;
  font-weight: 600;
  text-align: center;
}

/* Animación del spinner */
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* Transiciones fade para loader */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Transiciones para páginas */
.page-enter-active,
.page-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.page-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

.page-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>