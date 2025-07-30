<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 p-4 md:p-6">
    <div class="max-w-7xl mx-auto">
      <!-- Header mejorado -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <div class="flex flex-col md:flex-row md:items-center md:justify-between">
          <div class="flex items-center space-x-4 mb-4 md:mb-0">
            <div class="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
              </svg>
            </div>
            <div>
              <h1 class="text-3xl font-bold text-gray-800">{{ vehiculo?.placa || 'Vehículo' }}</h1>
              <p class="text-gray-600 mt-1">{{ vehiculo?.marca }} {{ vehiculo?.modelo }} - {{ vehiculo?.anio }}</p>
            </div>
          </div>
          
          <div class="flex items-center space-x-3">
            <button
              @click="goToEdit"
              class="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-sm transition-all duration-200 hover:shadow-md"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
              </svg>
              <span>Editar</span>
            </button>
            
            <button
              @click="goBack"
              class="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg shadow-sm transition-all duration-200 hover:shadow-md"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
              </svg>
              <span>Volver</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Estados de carga y error -->
      <div v-if="loading" class="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
        <div class="flex items-center space-x-3">
          <svg class="animate-spin h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <div>
            <h3 class="text-lg font-semibold text-blue-800">Cargando datos...</h3>
            <p class="text-blue-600">Obteniendo información del vehículo</p>
          </div>
        </div>
      </div>

      <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
        <div class="flex items-center space-x-3">
          <svg class="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
          </svg>
          <div>
            <h3 class="text-lg font-semibold text-red-800">Error al cargar vehículo</h3>
            <p class="text-red-600">{{ error.message || error }}</p>
          </div>
        </div>
      </div>

      <!-- Contenido principal -->
      <div v-else class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        <!-- Datos básicos -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div class="bg-gradient-to-r from-green-500 to-green-600 px-6 py-4">
            <h2 class="text-xl font-semibold text-white flex items-center">
              <svg class="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              Datos Básicos
            </h2>
          </div>
          
          <div class="p-6 space-y-4">
            <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div class="flex items-center space-x-3">
                <div class="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <svg class="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path>
                  </svg>
                </div>
                <span class="text-sm font-medium text-gray-600">Placa</span>
              </div>
              <span class="text-lg font-bold text-gray-800">{{ vehiculo.placa }}</span>
            </div>

            <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div class="flex items-center space-x-3">
                <div class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                  </svg>
                </div>
                <span class="text-sm font-medium text-gray-600">Año</span>
              </div>
              <span class="text-lg font-bold text-gray-800">{{ vehiculo.anio }}</span>
            </div>

            <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div class="flex items-center space-x-3">
                <div class="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                  <svg class="w-4 h-4 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                  </svg>
                </div>
                <span class="text-sm font-medium text-gray-600">Kilometraje</span>
              </div>
              <span class="text-lg font-bold text-gray-800">{{ parseFloat(vehiculo.kilometraje).toFixed(1) }} km</span>
            </div>

            <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div class="flex items-center space-x-3">
                <div class="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                  <svg class="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
                  </svg>
                </div>
                <span class="text-sm font-medium text-gray-600">Costo</span>
              </div>
              <span class="text-lg font-bold text-red-600">S/ {{ parseFloat(vehiculo.costo).toFixed(2) }}</span>
            </div>
          </div>
        </div>

        <!-- Tarjeta del vehículo -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div class="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4">
            <h2 class="text-xl font-semibold text-white flex items-center">
              <svg class="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
              Tarjeta del Vehículo
            </h2>
          </div>
          
          <div class="p-6">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div class="space-y-3">
                <div class="bg-blue-50 p-3 rounded-lg">
                  <div class="text-xs font-medium text-blue-600 mb-1">Categoría</div>
                  <div class="text-sm font-semibold text-gray-800">{{ vehiculo.categoria }}</div>
                </div>
                <div class="bg-blue-50 p-3 rounded-lg">
                  <div class="text-xs font-medium text-blue-600 mb-1">Marca</div>
                  <div class="text-sm font-semibold text-gray-800">{{ vehiculo.marca }}</div>
                </div>
                <div class="bg-blue-50 p-3 rounded-lg">
                  <div class="text-xs font-medium text-blue-600 mb-1">Modelo</div>
                  <div class="text-sm font-semibold text-gray-800">{{ vehiculo.modelo }}</div>
                </div>
                <div class="bg-blue-50 p-3 rounded-lg">
                  <div class="text-xs font-medium text-blue-600 mb-1">Versión</div>
                  <div class="text-sm font-semibold text-gray-800">{{ vehiculo.version || "—" }}</div>
                </div>
                <div class="bg-blue-50 p-3 rounded-lg">
                  <div class="text-xs font-medium text-blue-600 mb-1">Color</div>
                  <div class="text-sm font-semibold text-gray-800">{{ vehiculo.color || "—" }}</div>
                </div>
                <div class="bg-blue-50 p-3 rounded-lg">
                  <div class="text-xs font-medium text-blue-600 mb-1">Año Fabricación</div>
                  <div class="text-sm font-semibold text-gray-800">{{ vehiculo.anio_fabricacion }}</div>
                </div>
                <div class="bg-blue-50 p-3 rounded-lg">
                  <div class="text-xs font-medium text-blue-600 mb-1">Año Modelo</div>
                  <div class="text-sm font-semibold text-gray-800">{{ vehiculo.anio_modelo }}</div>
                </div>
                <div class="bg-blue-50 p-3 rounded-lg">
                  <div class="text-xs font-medium text-blue-600 mb-1">Motor</div>
                  <div class="text-sm font-semibold text-gray-800">{{ vehiculo.motor || "—" }}</div>
                </div>
              </div>
              
              <div class="space-y-3">
                <div class="bg-blue-50 p-3 rounded-lg">
                  <div class="text-xs font-medium text-blue-600 mb-1">Combustible</div>
                  <div class="text-sm font-semibold text-gray-800">{{ vehiculo.combustible }}</div>
                </div>
                <div class="bg-blue-50 p-3 rounded-lg">
                  <div class="text-xs font-medium text-blue-600 mb-1">Forma Rodante</div>
                  <div class="text-sm font-semibold text-gray-800">{{ vehiculo.forma_rodante }}</div>
                </div>
                <div class="bg-blue-50 p-3 rounded-lg overflow-x-auto">
                  <div class="text-xs font-medium text-blue-600 mb-1">VIN</div>
                  <div
                    class="text-sm font-semibold text-gray-800 font-mono break-words break-all whitespace-break-spaces"
                  >
                    {{ vehiculo.vin }}
                  </div>
                </div>
                <div class="bg-blue-50 p-3 rounded-lg">
                  <div class="text-xs font-medium text-blue-600 mb-1">Serie Chasis</div>
                  <div class="text-sm font-semibold text-gray-800">{{ vehiculo.serie_chasis || "—" }}</div>
                </div>
                <div class="bg-blue-50 p-3 rounded-lg">
                  <div class="text-xs font-medium text-blue-600 mb-1">Ejes</div>
                  <div class="text-sm font-semibold text-gray-800">{{ vehiculo.ejes }}</div>
                </div>
                <div class="bg-blue-50 p-3 rounded-lg">
                  <div class="text-xs font-medium text-blue-600 mb-1">Ruedas</div>
                  <div class="text-sm font-semibold text-gray-800">{{ vehiculo.ruedas }}</div>
                </div>
                <div class="bg-blue-50 p-3 rounded-lg">
                  <div class="text-xs font-medium text-blue-600 mb-1">Pasajeros</div>
                  <div class="text-sm font-semibold text-gray-800">{{ vehiculo.pasajeros }}</div>
                </div>
                <div class="bg-blue-50 p-3 rounded-lg">
                  <div class="text-xs font-medium text-blue-600 mb-1">Carrocería</div>
                  <div class="text-sm font-semibold text-gray-800">{{ vehiculo.carroceria || "—" }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Dimensiones y pesos -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div class="bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-4">
            <h2 class="text-xl font-semibold text-white flex items-center">
              <svg class="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"></path>
              </svg>
              Dimensiones y Pesos
            </h2>
          </div>
          
          <div class="p-6 space-y-4">
            <!-- Pesos -->
            <div class="bg-orange-50 p-4 rounded-lg">
              <h3 class="text-sm font-semibold text-orange-800 mb-3 flex items-center">
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"></path>
                </svg>
                Pesos
              </h3>
              <div class="grid grid-cols-3 gap-3">
                <div class="text-center">
                  <div class="text-xs text-gray-600 mb-1">Peso Neto</div>
                  <div class="text-lg font-bold text-orange-600">{{ vehiculo.peso_neto }} kg</div>
                </div>
                <div class="text-center">
                  <div class="text-xs text-gray-600 mb-1">Peso Bruto</div>
                  <div class="text-lg font-bold text-orange-600">{{ vehiculo.peso_bruto }} kg</div>
                </div>
                <div class="text-center">
                  <div class="text-xs text-gray-600 mb-1">Carga Útil</div>
                  <div class="text-lg font-bold text-orange-600">{{ vehiculo.carga_util }} kg</div>
                </div>
              </div>
            </div>

            <!-- Motor -->
            <div class="bg-orange-50 p-4 rounded-lg">
              <h3 class="text-sm font-semibold text-orange-800 mb-3 flex items-center">
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                </svg>
                Motor
              </h3>
              <div class="grid grid-cols-2 gap-3">
                <div class="text-center">
                  <div class="text-xs text-gray-600 mb-1">Cilindrada</div>
                  <div class="text-lg font-bold text-orange-600">{{ vehiculo.cilindrada }} cc</div>
                </div>
                <div class="text-center">
                  <div class="text-xs text-gray-600 mb-1">Cilindros</div>
                  <div class="text-lg font-bold text-orange-600">{{ vehiculo.cilindros }}</div>
                </div>
              </div>
            </div>

            <!-- Dimensiones -->
            <div class="bg-orange-50 p-4 rounded-lg">
              <h3 class="text-sm font-semibold text-orange-800 mb-3 flex items-center">
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"></path>
                </svg>
                Dimensiones
              </h3>
              <div class="grid grid-cols-3 gap-3">
                <div class="text-center">
                  <div class="text-xs text-gray-600 mb-1">Altura</div>
                  <div class="text-lg font-bold text-orange-600">{{ vehiculo.altura }} m</div>
                </div>
                <div class="text-center">
                  <div class="text-xs text-gray-600 mb-1">Ancho</div>
                  <div class="text-lg font-bold text-orange-600">{{ vehiculo.ancho }} m</div>
                </div>
                <div class="text-center">
                  <div class="text-xs text-gray-600 mb-1">Longitud</div>
                  <div class="text-lg font-bold text-orange-600">{{ vehiculo.longitud }} m</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '@/services/authService.js'

import {
  NAlert,
  NCard,
  NPageHeader,
  NButton
} from 'naive-ui'

const route = useRoute()
const router = useRouter()
const id = route.params.id

const vehiculo = ref({})
const loading = ref(true)
const error = ref(null)

onMounted(async () => {
  try {
    const { data } = await api.get(`vehiculos/${id}/`)
    vehiculo.value = data
  } catch (err) {
    console.error('Error al obtener vehículo:', err)
    error.value = err
  } finally {
    loading.value = false
  }
})

const goToEdit = () => {
  router.push({ name: 'VehiculoEdit', params: { id } })
}
const goBack = () => {
  router.push({ name: 'Vehiculos' })
}
</script>