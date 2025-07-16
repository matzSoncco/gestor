<template>
  <div class="space-y-6">
    <n-page-header 
      title="Registro de Operación" 
      subtitle="Registra combustible, mantenimiento y servicios para vehículos"
    />

    <n-form 
      @submit.prevent="submitForm"
      class="space-y-6"
    >
      <!-- Información básica -->
      <n-card title="Información del Documento" class="shadow-sm">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <n-form-item label="N° de Factura o Documento (*)">
            <n-input
              v-model:value="formData.numero_documento"
              placeholder="Ingrese número de documento"
              clearable
            />
          </n-form-item>
          
          <n-form-item label="RUC del Proveedor (*)">
            <n-input
              v-model:value="formData.ruc_proveedor"
              placeholder="Ingrese RUC (11 dígitos)"
              maxlength="11"
              clearable
            />
          </n-form-item>
        </div>
        
        <n-form-item label="Nombre del Proveedor (*)">
          <n-input
            v-model:value="formData.nombre_proveedor"
            placeholder="Aquí se mostrará el nombre del proveedor"
            readonly
            class="bg-gray-50"
          />
        </n-form-item>
      </n-card>

      <!-- Información de la operación -->
      <n-card title="Detalles de la Operación" class="shadow-sm">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <n-form-item label="Tipo de Operación (*)">
            <n-select
              v-model:value="formData.tipo_operacion"
              placeholder="Seleccione un tipo"
              :options="[
                { label: 'Combustible', value: 'combustible' },
                { label: 'Mantenimiento', value: 'mantenimiento' },
                { label: 'Servicio', value: 'servicio' }
              ]"
            />
          </n-form-item>
          
          <n-form-item label="Fecha (*)">
            <n-date-picker
              v-model:formatted-value="formData.fecha"
              type="date"
              placeholder="Seleccione fecha"
              class="w-full"
            />
          </n-form-item>
        </div>
      </n-card>

      <!-- Detalles específicos por tipo -->
      <n-collapse-transition :show="!!formData.tipo_operacion">
        <div class="space-y-4">
          <!-- Combustible -->
          <n-card 
            v-if="formData.tipo_operacion === 'combustible'"
            title="Detalles de Combustible"
            class="shadow-sm"
          >
            <div class="space-y-4">
              <div
                v-for="(comb, index) in formData.combustibles"
                :key="comb.id"
                class="p-4 border border-gray-200 rounded-lg bg-gray-50"
              >
                <div class="flex justify-between items-center mb-3">
                  <h4 class="text-sm font-medium text-gray-700">
                    Combustible {{ index + 1 }}
                  </h4>
                  <n-button
                    v-if="formData.combustibles.length > 1"
                    @click="removeCombustibleRow(comb.id)"
                    type="error"
                    size="small"
                    circle
                  >
                    <template #icon>
                      <n-icon>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                        </svg>
                      </n-icon>
                    </template>
                  </n-button>
                </div>
                
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <n-form-item label="Cantidad (Galones) (*)">
                    <n-input-number
                      v-model:value="comb.cantidad_galones"
                      placeholder="0.00"
                      :min="0"
                      :step="0.01"
                      :precision="2"
                      class="w-full"
                    />
                  </n-form-item>
                  
                  <n-form-item label="Costo por Galón (S/) (*)">
                    <n-input-number
                      v-model:value="comb.costo_por_galon"
                      placeholder="0.00"
                      :min="0"
                      :step="0.01"
                      :precision="2"
                      class="w-full"
                    />
                  </n-form-item>
                  
                  <n-form-item label="Subtotal (S/) (*)">
                    <n-input
                      :value="comb.subtotal?.toFixed(2) || '0.00'"
                      readonly
                      class="bg-gray-100"
                    />
                  </n-form-item>
                  
                  <n-form-item label="Vehículo (*)">
                    <n-select
                      v-model:value="comb.placa_vehiculo"
                      placeholder="Seleccione vehículo"
                      :options="listaVehiculos.map(v => ({ label: v.placa, value: v.id }))"
                    />
                  </n-form-item>
                </div>
              </div>
              
              <div class="flex justify-between items-center">
                <n-button
                  @click="addCombustibleRow"
                  type="primary"
                  dashed
                  class="w-full"
                >
                  <template #icon>
                    <n-icon>
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
                      </svg>
                    </n-icon>
                  </template>
                  Agregar Fila de Combustible
                </n-button>
              </div>
              
              <n-statistic
                label="Costo Total Combustible"
                :value="costoTotalCombustible"
                :precision="2"
                class="text-right"
              >
                <template #suffix>
                  <span class="text-sm text-gray-500">S/</span>
                </template>
              </n-statistic>
            </div>
          </n-card>

          <!-- Mantenimiento -->
          <n-card 
            v-if="formData.tipo_operacion === 'mantenimiento'"
            title="Detalles de Mantenimiento"
            class="shadow-sm"
          >
            <div class="space-y-4">
              <div
                v-for="(mant, index) in formData.mantenimientos"
                :key="mant.id"
                class="p-4 border border-gray-200 rounded-lg bg-gray-50"
              >
                <div class="flex justify-between items-center mb-3">
                  <h4 class="text-sm font-medium text-gray-700">
                    Mantenimiento {{ index + 1 }}
                  </h4>
                  <n-button
                    v-if="formData.mantenimientos.length > 1"
                    @click="removeMantenimientoRow(mant.id)"
                    type="error"
                    size="small"
                    circle
                  >
                    <template #icon>
                      <n-icon>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                        </svg>
                      </n-icon>
                    </template>
                  </n-button>
                </div>
                
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <n-form-item label="Item/Servicio (*)" class="relative">
                    <n-input
                      v-model:value="mant.descripcion_item"
                      placeholder="Escriba o seleccione item"
                      @input="updateSugerencias($event.target.value, index)"
                      @focus="updateSugerencias($event.target.value, index)"
                      @blur="blurHandler(index)"
                      autocomplete="off"
                    />
                    <div
                      v-if="sugerencias.length > 0 && inputActivo === index"
                      class="absolute z-10 w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-48 overflow-y-auto mt-1"
                    >
                      <div
                        v-for="suggestion in sugerencias"
                        :key="suggestion"
                        @mousedown.prevent="selectItem(suggestion, index)"
                        class="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                      >
                        {{ suggestion }}
                      </div>
                    </div>
                  </n-form-item>
                  
                  <n-form-item label="Cantidad (*)">
                    <n-input-number
                      v-model:value="mant.cantidad"
                      placeholder="1"
                      :min="1"
                      class="w-full"
                    />
                  </n-form-item>
                  
                  <n-form-item label="Costo Unit. (S/) (*)">
                    <n-input-number
                      v-model:value="mant.costo_unitario"
                      placeholder="0.00"
                      :min="0"
                      :step="0.01"
                      :precision="2"
                      class="w-full"
                    />
                  </n-form-item>
                  
                  <n-form-item label="Subtotal (S/) (*)">
                    <n-input
                      :value="mant.subtotal?.toFixed(2) || '0.00'"
                      readonly
                      class="bg-gray-100"
                    />
                  </n-form-item>
                </div>
                
                <n-form-item label="Vehículo (*)">
                  <n-select
                    v-model:value="mant.placa_vehiculo"
                    placeholder="Seleccione vehículo"
                    :options="listaVehiculos.map(v => ({ label: v.placa, value: v.id }))"
                    class="w-full"
                  />
                </n-form-item>
              </div>
              
              <n-button
                @click="addMantenimientoRow"
                type="primary"
                dashed
                class="w-full"
              >
                <template #icon>
                  <n-icon>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
                    </svg>
                  </n-icon>
                </template>
                Agregar Fila de Mantenimiento
              </n-button>
              
              <n-statistic
                label="Costo Total Mantenimiento"
                :value="costoTotal"
                :precision="2"
                class="text-right"
              >
                <template #suffix>
                  <span class="text-sm text-gray-500">S/</span>
                </template>
              </n-statistic>
            </div>
          </n-card>

          <!-- Servicio -->
          <n-card 
            v-if="formData.tipo_operacion === 'servicio'"
            title="Detalles del Servicio"
            class="shadow-sm"
          >
            <div class="space-y-4">
              <div
                v-for="(serv, index) in formData.servicios"
                :key="serv.id"
                class="p-4 border border-gray-200 rounded-lg bg-gray-50"
              >
                <div class="flex justify-between items-center mb-3">
                  <h4 class="text-sm font-medium text-gray-700">
                    Servicio {{ index + 1 }}
                  </h4>
                  <n-button
                    v-if="formData.servicios.length > 1"
                    @click="removeServicioRow(serv.id)"
                    type="error"
                    size="small"
                    circle
                  >
                    <template #icon>
                      <n-icon>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                        </svg>
                      </n-icon>
                    </template>
                  </n-button>
                </div>
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <n-form-item label="Descripción del Servicio (*)">
                    <n-input
                      v-model:value="serv.descripcion_item"
                      placeholder="Especifique el servicio"
                      clearable
                    />
                  </n-form-item>
                  
                  <n-form-item label="Costo (S/) (*)">
                    <n-input-number
                      v-model:value="serv.costo_servicio"
                      placeholder="0.00"
                      :min="0"
                      :step="0.01"
                      :precision="2"
                      class="w-full"
                    />
                  </n-form-item>
                </div>
                
                <n-form-item label="Vehículo (*)">
                  <n-select
                    v-model:value="serv.placa_vehiculo"
                    placeholder="Seleccione vehículo"
                    :options="listaVehiculos.map(v => ({ label: v.placa, value: v.id }))"
                    class="w-full"
                  />
                </n-form-item>
              </div>
              
              <n-button
                @click="addServicioRow"
                type="primary"
                dashed
                class="w-full"
              >
                <template #icon>
                  <n-icon>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
                    </svg>
                  </n-icon>
                </template>
                Agregar Fila de Servicio
              </n-button>
              
              <n-statistic
                label="Costo Total Servicio"
                :value="costoTotalServicio"
                :precision="2"
                class="text-right"
              >
                <template #suffix>
                  <span class="text-sm text-gray-500">S/</span>
                </template>
              </n-statistic>
            </div>
          </n-card>

          <!-- Descripción adicional -->
          <n-card title="Información Adicional" class="shadow-sm">
            <n-form-item label="Descripción Adicional">
              <n-input
                v-model:value="formData.descripcion"
                type="textarea"
                placeholder="Agregue información adicional aquí..."
                :rows="3"
                show-count
                maxlength="500"
              />
            </n-form-item>
          </n-card>
        </div>
      </n-collapse-transition>

      <!-- Acciones -->
      <div class="flex flex-col md:flex-row gap-3 justify-end">
        <n-button
          @click="resetForm"
          :disabled="loading"
          class="w-full md:w-auto"
        >
          <template #icon>
            <n-icon>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 5V1L7 6l5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z"/>
              </svg>
            </n-icon>
          </template>
          Limpiar Formulario
        </n-button>
        
        <n-button
          @click="submitForm"
          type="primary"
          :loading="loading"
          class="w-full md:w-auto"
        >
          <template #icon>
            <n-icon>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
              </svg>
            </n-icon>
          </template>
          {{ loading ? 'Enviando...' : 'Registrar Operación' }}
        </n-button>
      </div>
    </n-form>
  </div>
</template>

<script setup>
import api from '../../services/authService';
import { onMounted, ref } from 'vue';
import { useOpForm } from '../../composables/operaciones/useOpForm';

const listaVehiculos = ref([]);

onMounted(async () => {
  try {
    const response = await api.get('vehiculos/');
    listaVehiculos.value = response.data;
  } catch (error) {
    console.error('Error al cargar vehículos:', error.response || error);
    listaVehiculos.value = [];
  }
});

const {
  formData,
  loading,

  addCombustibleRow,
  removeCombustibleRow,

  addMantenimientoRow,
  removeMantenimientoRow,
  updateSugerencias,
  selectItem,
  blurHandler,
  sugerencias,
  inputActivo,
  costoTotalCombustible,
  costoTotalServicio,
  costoTotal,

  addServicioRow,
  removeServicioRow,

  resetForm,
  submitForm 
} = useOpForm();
</script>