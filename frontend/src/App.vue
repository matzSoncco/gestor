<template>
  <n-config-provider>
    <n-notification-provider>
      <Transition name="fade" mode="out-in">
        <div
          v-if="auth.isLoading"
          key="loader"
          class="fixed inset-0 bg-gray-200 bg-opacity-75 flex items-center justify-center z-50"
        >
          <div class="flex flex-col items-center">
            <div
              class="app-loader ease-linear rounded-full border-4 border-t-4 border-blue-500 h-16 w-16 mb-4"
            ></div>
            <p class="text-xl text-gray-700 font-semibold">
              Cargando aplicación...
            </p>
          </div>
        </div>

        <router-view v-else key="router" />
      </Transition>
    </n-notification-provider>
  </n-config-provider>
</template>

<script setup lang="ts">
import { useAuthStore } from "@/stores/auth";

const auth = useAuthStore();
</script>

<style>
.app-loader {
  border-top-color: transparent;
  animation: spinner 1s linear infinite;
}

@keyframes spinner {
  to {
    transform: rotate(360deg);
  }
}
</style>