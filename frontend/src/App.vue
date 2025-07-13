<template>
  <n-config-provider>
    <n-notification-provider>
      <router-view />
    </n-notification-provider>
  </n-config-provider>
</template>

<script setup>
import { NConfigProvider, NNotificationProvider } from 'naive-ui'
</script>