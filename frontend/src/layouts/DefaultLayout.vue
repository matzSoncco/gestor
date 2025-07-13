<template>
  <n-config-provider>
    <n-dialog-provider>
      <n-notification-provider>
        <n-message-provider>
          <n-layout has-sider class="h-screen">
            <!-- Sidebar -->
            <n-layout-sider
              bordered
              :width="220"
              collapse-mode="width"
              show-trigger="bar"
              content-style="padding: 0"
              class="bg-white border-r"
            >
              <Sidebar />
            </n-layout-sider>

            <!-- Contenido principal -->
            <n-layout class="flex flex-col">
              <!-- Header -->
              <n-layout-header
                bordered
                class="h-14 px-6 flex items-center bg-gray-50 shadow-sm"
              >
                <h1 class="text-lg font-semibold text-gray-800">Gestor de Flota</h1>
              </n-layout-header>

              <!-- Contenido dinámico -->
              <n-layout-content class="flex-1 overflow-y-auto p-6 bg-gray-50">
                <router-view />
              </n-layout-content>
            </n-layout>
          </n-layout>
        </n-message-provider>
      </n-notification-provider>
    </n-dialog-provider>
  </n-config-provider>
</template>

<script setup lang="ts">
import Sidebar from '@/components/Sidebar.vue'

import {
  NConfigProvider,
  NLayout,
  NLayoutSider,
  NLayoutHeader,
  NLayoutContent,
  NDialogProvider,
  NNotificationProvider,
  NMessageProvider
} from 'naive-ui'
</script>