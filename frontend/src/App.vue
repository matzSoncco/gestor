<template>
  <n-config-provider>
    <n-notification-provider>
      <router-view v-if="!auth.isLoading" />
    </n-notification-provider>
  </n-config-provider>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth'
const auth = useAuthStore()
</script>