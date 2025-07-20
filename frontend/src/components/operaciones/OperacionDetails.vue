<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 md:p-6">
    <div class="max-w-6xl mx-auto">
      <!-- Header con botón de regreso -->
      <div class="flex items-center justify-between mb-6">
        <div class="flex items-center space-x-4">
          <button
            @click="goBack"
            class="flex items-center space-x-2 px-4 py-2 bg-white hover:bg-gray-50 text-gray-700 rounded-lg shadow-sm border border-gray-200 transition-all duration-200 hover:shadow-md"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
            </svg>
            <span>Volver</span>
          </button>
          <div class="h-6 w-px bg-gray-300"></div>
          <h1 class="text-2xl font-bold text-gray-800">Operación #{{ id }}</h1>
        </div>
        
        <!-- Badge de estado -->
        <div class="flex items-center space-x-2">
          <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
            <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
            </svg>
            Completada
          </span>
        </div>
      </div>

      <!-- Estados de carga y error -->
      <div v-if="loading" class="flex items-center justify-center py-12">
        <div class="flex items-center space-x-3 text-gray-600">
          <svg class="animate-spin h-6 w-6" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span class="text-lg">Cargando información...</span>
        </div>
      </div>

      <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-6">
        <div class="flex items-center space-x-3">
          <svg class="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
          </svg>
          <div>
            <h3 class="text-lg font-semibold text-red-800">Error al cargar</h3>
            <p class="text-red-600">{{ errorMessage }}</p>
          </div>
        </div>
      </div>

      <!-- Contenido principal -->
      <div v-else class="space-y-6">
        <!-- Card de información general -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div class="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
            <h2 class="text-xl font-semibold text-white flex items-center">
              <svg class="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              Información General
            </h2>
          </div>
          
          <div class="p-6">
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div v-for="(value, label) in generalInfo" :key="label" 
                   class="bg-gray-50 rounded-lg p-4 border border-gray-100">
                <div class="text-sm font-medium text-gray-600 mb-1">{{ label }}</div>
                <div class="text-lg font-semibold" 
                     :class="label === 'Costo Total' ? 'text-red-600' : 'text-gray-900'">
                  {{ value }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Detalle de Combustible -->
        <div v-if="operacion.tipo_operacion === 'combustible'" 
             class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div class="bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-4">
            <h2 class="text-xl font-semibold text-white flex items-center">
              <svg class="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z"></path>
              </svg>
              Detalle de Combustible
            </h2>
          </div>
          
          <div class="p-6">
            <div v-if="!operacion.combustible_detalle?.length" 
                 class="text-center py-8 text-gray-500">
              <svg class="w-12 h-12 mx-auto mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path>
              </svg>
              <p>No hay registros de combustible</p>
            </div>
            
            <div v-else class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <div v-for="c in operacion.combustible_detalle" :key="c.id" 
                   class="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-4 border border-orange-200">
                <div class="flex items-center justify-between mb-3">
                  <div class="flex items-center space-x-2">
                    <div class="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                      <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"></path>
                      </svg>
                    </div>
                    <span class="font-semibold text-gray-700">{{ getPlacaVehiculo(c.placa_vehiculo) }}</span>
                  </div>
                  <span class="text-lg font-bold text-green-600">S/. {{ c.subtotal }}</span>
                </div>
                <div class="space-y-2 text-sm">
                  <div class="flex justify-between">
                    <span class="text-gray-600">Galones:</span>
                    <span class="font-medium">{{ c.cantidad_galones }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-600">Precio/galón:</span>
                    <span class="font-medium">S/. {{ c.costo_por_galon }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Detalle de Mantenimiento -->
        <div v-if="operacion.tipo_operacion === 'mantenimiento'" 
             class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div class="bg-gradient-to-r from-purple-500 to-purple-600 px-6 py-4">
            <h2 class="text-xl font-semibold text-white flex items-center">
              <svg class="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
              </svg>
              Detalle de Mantenimiento
            </h2>
          </div>
          
          <div class="p-6">
            <div v-if="!operacion.mantenimiento_detalle?.length" 
                 class="text-center py-8 text-gray-500">
              <svg class="w-12 h-12 mx-auto mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
              </svg>
              <p>No hay registros de mantenimiento</p>
            </div>
            
            <div v-else class="space-y-4">
              <div v-for="m in operacion.mantenimiento_detalle" :key="m.id" 
                   class="bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
                <div class="flex items-start justify-between mb-3">
                  <div class="flex-1">
                    <h4 class="font-semibold text-gray-800 mb-1">{{ m.descripcion_item }}</h4>
                    <div class="flex items-center space-x-2 text-sm text-gray-600">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                      <span>{{ getPlacaVehiculo(m.placa_vehiculo) }}</span>
                    </div>
                  </div>
                  <div class="text-right">
                    <div class="text-lg font-bold text-green-600">S/. {{ m.subtotal }}</div>
                    <div class="text-sm text-gray-500">{{ m.cantidad }} × S/. {{ m.costo_unitario }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Detalle de Servicio -->
        <div v-if="operacion.tipo_operacion === 'servicio'" 
             class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div class="bg-gradient-to-r from-green-500 to-green-600 px-6 py-4">
            <h2 class="text-xl font-semibold text-white flex items-center">
              <svg class="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V8a2 2 0 01-2 2H6a2 2 0 01-2-2V6m16 0v4.993A4.007 4.007 0 0116.007 15H7.993A4.007 4.007 0 014 10.993V6h16z"></path>
              </svg>
              Detalle de Servicio
            </h2>
          </div>
          
          <div class="p-6">
            <div v-if="!operacion.servicio_detalle?.length" 
                 class="text-center py-8 text-gray-500">
              <svg class="w-12 h-12 mx-auto mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
              </svg>
              <p>No hay registros de servicio</p>
            </div>
            
            <div v-else class="grid gap-4 md:grid-cols-2">
              <div v-for="s in operacion.servicio_detalle" :key="s.id" 
                   class="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
                <div class="flex items-start justify-between">
                  <div class="flex-1">
                    <div class="flex items-center space-x-2 mb-2">
                      <div class="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                        <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fill-rule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
                        </svg>
                      </div>
                      <span class="font-semibold text-gray-700">Servicio</span>
                    </div>
                    <p class="text-gray-600 mb-2">{{ s.descripcion_item }}</p>
                  </div>
                  <div class="text-right">
                    <div class="text-2xl font-bold text-green-600">S/. {{ s.costo_servicio }}</div>
                  </div>
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
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '@/services/authService.js'

const route = useRoute()
const router = useRouter()
const id = route.params.id

const operacion = ref(null)
const vehiculos = ref([])
const loading = ref(true)
const error = ref(false)
const errorMessage = ref('')

// Ir atrás
const goBack = () => router.back()

// Formatear fecha
const formatDate = (date) => {
  if (!date) return 'No especificada'
  const d = new Date(date)
  return d.toLocaleDateString('es-PE', { year: 'numeric', month: 'long', day: 'numeric' })
}

// Obtener placa del vehículo por ID
const getPlacaVehiculo = (id) => {
  const v = vehiculos.value.find(v => v.id === id)
  return v ? v.placa : `ID: ${id}`
}

// Propiedad computada para mostrar en la tabla general
const generalInfo = computed(() => {
  if (!operacion.value) return {}
  return {
    'Número Documento': operacion.value.numero_documento,
    'RUC Proveedor': operacion.value.ruc_proveedor,
    'Nombre Proveedor': operacion.value.nombre_proveedor,
    'Tipo Operación': operacion.value.tipo_operacion,
    'Fecha': formatDate(operacion.value.fecha),
    'Descripción': operacion.value.descripcion || 'Sin descripción',
    'Costo Total': `S/. ${operacion.value.costo_total}`
  }
})

// Fetch de datos
onMounted(async () => {
  try {
    const [v, o] = await Promise.all([
      api.get('vehiculos/'),
      api.get(`operaciones/${id}/`)
    ])
    vehiculos.value = v.data
    operacion.value = o.data
  } catch (err) {
    error.value = true
    errorMessage.value = err.response?.data || 'Error desconocido'
  } finally {
    loading.value = false
  }
})
</script>