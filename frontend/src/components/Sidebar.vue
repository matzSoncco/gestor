<template>
  <n-menu
    :collapsed="props.collapsed"
    :collapsed-width="64"
    :value="selected"
    :options="menuOptions"
    @update:value="handleSelect"
  />
</template>

<script setup lang="ts">
import { h, watch, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { NMenu, MenuOption } from 'naive-ui'
import {
  HomeOutlined as HomeIcon,
  CarOutlined as CarIcon,
  ReconciliationOutlined as OperacionesIcon,
  BarChartOutlined as ReportesIcon
} from '@vicons/antd'

const props = defineProps<{ collapsed: boolean }>()

const router = useRouter()
const route  = useRoute()
const selected = ref<string | number | null>(null)

const menuOptions: MenuOption[] = [
  { label: 'Inicio',       key: '/',            icon: () => h(HomeIcon) },
  { label: 'Vehículos',    key: '/vehiculos',   icon: () => h(CarIcon) },
  { label: 'Operaciones',  key: '/operaciones', icon: () => h(OperacionesIcon) },
  { label: 'Reportes',     key: '/reportes',    icon: () => h(ReportesIcon) }
]

watch(
  () => route.fullPath,
  (path) => { selected.value = menuOptions.find(o => path.startsWith(o.key as string))?.key || '/' },
  { immediate: true }
)

function handleSelect(key: string) {
  selected.value = key
  router.push(key)
}
</script>