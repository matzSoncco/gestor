<template>
  <n-config-provider>
    <n-notification-provider>
      <router-view v-if="!auth.isLoading" />
      <Transition name="fade">
      <div v-if="isAppLoading" class="fixed inset-0 bg-gray-200 bg-opacity-75 flex items-center justify-center z-50">
        <div class="flex flex-col items-center">
          <div class="app-loader ease-linear rounded-full border-4 border-t-4 border-blue-500 h-16 w-16 mb-4"></div>
          <p class="text-xl text-gray-700 font-semibold">Cargando aplicación...</p>
        </div>
      </div>
    </Transition>
    </n-notification-provider>
  </n-config-provider>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth'
import { useAppLoading } from '@/composables/global/useAppLoading';
import { NNotificationProvider } from 'naive-ui';

const auth = useAuthStore()
const { isAppLoading } = useAppLoading();
</script>