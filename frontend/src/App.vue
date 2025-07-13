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

<style>
/* Opcional: global styles si necesitas algo básico */
body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", sans-serif;
  background-color: #f5f5f5;
}
</style>