<template>
  <n-config-provider>
    <n-dialog-provider>
      <n-notification-provider>
        <n-message-provider>
          <n-layout v-if="authStore.isAuthenticated" has-sider class="h-screen">
            <!-- SIDEBAR -->
            <n-layout-sider
              bordered
              :width="220"
              :collapsed-width="64"
              show-trigger="bar"
              collapse-mode="width"
              :collapsed="collapsed"
              @update:collapsed="collapsed = $event"
              class="bg-white light:bg-neutral-900 border-r dark:border-neutral-700 transition-width"
            >
              <Sidebar :collapsed="collapsed" />
            </n-layout-sider>

            <!-- MAIN -->
            <n-layout class="flex flex-col">
              <n-layout-header
                bordered
                class="h-14 px-6 flex items-center bg-gray-50 light:bg-neutral-800 shadow-sm"
              >
                <h1 class="text-lg font-semibold text-gray-800 dark:text-dark">
                  Gestor de Flota de Vehículos | {{ auth.user?.empresa?.razon_social }}
                </h1>
              </n-layout-header>

              <n-layout-content class="flex-1 overflow-y-auto p-6 bg-gray-50 light:bg-neutral-800">
                <router-view />
              </n-layout-content>
            </n-layout>
          </n-layout>
          <router-view v-else />
        </n-message-provider>
      </n-notification-provider>
    </n-dialog-provider>
  </n-config-provider>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import Sidebar from '@/components/Sidebar.vue'
import { useAuthStore } from '@/stores/auth'
import { getCurrentUser } from '@/api/user'
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

const auth = useAuthStore()

onMounted(async () => {
  // Si el usuario no tiene first_name, obtener datos completos
  if (auth.isAuthenticated && (!auth.user?.first_name)) {
    try {
      const userResult = await getCurrentUser()
      if (userResult.success) {
        auth.user = userResult.user
        localStorage.setItem('user', JSON.stringify(userResult.user))
      }
    } catch (error) {
      console.error('Error loading user data:', error)
    }
  }
})

/* estado global de colapso */
const collapsed = ref(false)
const authStore = useAuthStore()
</script>