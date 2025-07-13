<template>
  <n-menu
    :collapsed="collapsed"
    :collapsed-width="64"
    :options="menuOptions"
    :value="selected"
    @update:value="handleSelect"
  />
</template>

<script setup lang="ts">
import { h, ref, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { NMenu, MenuOption } from 'naive-ui'
import {
  HomeOutlined as HomeIcon,
  CarOutlined as CarIcon,
  ReconciliationOutlined as OperacionesIcon,
  BarChartOutlined as ReportesIcon
} from '@vicons/antd'

const router = useRouter()
const route  = useRoute()

const selected = ref<string | null>(null)
const collapsed = ref(false)

const menuOptions: MenuOption[] = [
  { label: 'Inicio',       key: '/',            icon: () => h(HomeIcon) },
  { label: 'Vehículos',    key: '/vehiculos',   icon: () => h(CarIcon) },
  { label: 'Operaciones',  key: '/operaciones', icon: () => h(OperacionesIcon) },
  { label: 'Reportes',     key: '/reportes',    icon: () => h(ReportesIcon) }
]

/* sincronizar selección con la ruta actual */
watch(
  () => route.fullPath,
  (path) => { selected.value = getMatchedKey(path) },
  { immediate: true }
)

function getMatchedKey(path: string): string {
  const match = menuOptions.find(o => path.startsWith(o.key as string))
  return match ? (match.key as string) : '/'
}

function handleSelect(key: string) {
  selected.value = key
  router.push(key)
}
</script>