<template>
  <div class="space-y-6">
    <n-page-header 
      title="Registro de Vehículo" 
      subtitle="Registra todos los componentes del vehículo"
    />
    <n-form label-placement="top" class="space-y-6">
      <!-- Sección: Datos Básicos -->
      <n-card title="Datos Básicos del Vehículo" class="shadow-ms">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <n-form-item label="Placa (*)">
            <n-input
              v-model:value="formData.placa"
              placeholder="ABC123"
              maxlength="6"
              show-count
              @input="formData.placa = formData.placa.toUpperCase().replace(/[^A-Z0-9]/g, '')"
            />
          </n-form-item>
            <n-form-item label="Año (*)">
              <n-input-number v-model:value="formData.anio" :min="1900" :max="2100" placeholder="2020" />
            </n-form-item>
            <n-form-item label="Kilometraje (*)">
              <n-input-number v-model:value="formData.kilometraje" :min="0" step="0.1" placeholder="0.0" />
            </n-form-item>
            <n-form-item label="Costo (S/) (*)">
              <n-input-number v-model:value="formData.costo" :min="0" :precision="2" placeholder="25000.00" />
            </n-form-item>
            <n-form-item label="Ubicación (*)">
              <n-input v-model:value="formData.ubicacion" placeholder="Arequipa, Perú" />
            </n-form-item>
          </div>
      </n-card>

      <!-- Sección: Tarjeta del Vehículo -->
      <n-card title="Tarjeta del Vehículo" class="shadow-ms">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <n-form-item label="Categoría (*)">
            <n-input v-model:value="formData.categoria" />
          </n-form-item>
          <n-form-item label="Marca (*)">
            <n-input v-model:value="formData.marca" />
          </n-form-item>
          <n-form-item label="Modelo (*)">
            <n-input v-model:value="formData.modelo" />
          </n-form-item>
          <n-form-item label="Versión (*)">
            <n-input v-model:value="formData.version" />
          </n-form-item>
          <n-form-item label="Color (*)">
            <n-input v-model:value="formData.color" />
          </n-form-item>
          <n-form-item label="Año de Fabricación (*)">
            <n-input-number v-model:value="formData.anio_fabricacion" :min="1900" :max="2100" />
          </n-form-item>
          <n-form-item label="Año de Modelo (*)">
            <n-input-number v-model:value="formData.anio_modelo" :min="1900" :max="2100" />
          </n-form-item>
          <n-form-item label="Motor (*)">
            <n-input v-model:value="formData.motor" />
          </n-form-item>
          <n-form-item label="Combustible (*)">
            <n-select
              v-model:value="formData.combustible"
              :options="[
                { label: 'Gasolina', value: 'GASOLINA' },
                { label: 'Diésel', value: 'DIÉSEL' },
                { label: 'Eléctrico', value: 'ELÉCTRICO' }
              ]"
              placeholder="Seleccione tipo"
            />
          </n-form-item>
          <n-form-item label="Forma Rodante (*)">
            <n-input v-model:value="formData.forma_rodante" />
          </n-form-item>
          <n-form-item label="VIN (*)">
            <n-input
              v-model:value="formData.vin"
              placeholder="17 caracteres (sin I, O, Q)"
              maxlength="17"
              show-count
              @input="formData.vin = formData.vin.toUpperCase().replace(/[^A-HJ-NPR-Z0-9]/g, '')"
            />
          </n-form-item>
          <n-form-item label="Serie de Chasis (*)">
            <n-input v-model:value="formData.serie_chasis" />
          </n-form-item>

          <n-form-item label="Ejes (*)">
            <n-input-number v-model:value="formData.ejes" :min="0" />
          </n-form-item>
          <n-form-item label="Ruedas (*)">
            <n-input-number v-model:value="formData.ruedas" :min="0" />
          </n-form-item>
          <n-form-item label="Pasajeros (*)">
            <n-input-number v-model:value="formData.pasajeros" :min="0" />
          </n-form-item>
          <n-form-item label="Carrocería (*)">
            <n-input v-model:value="formData.carroceria" />
          </n-form-item>
          <n-form-item label="Peso Neto (kg) (*)">
            <n-input-number v-model:value="formData.peso_neto" :min="0" :precision="3" />
          </n-form-item>
          <n-form-item label="Peso Bruto (kg) (*)">
            <n-input-number v-model:value="formData.peso_bruto" :min="0" :precision="3" />
          </n-form-item>
          <n-form-item label="Carga Útil (kg) (*)">
            <n-input-number v-model:value="formData.carga_util" :min="0" :precision="3" />
          </n-form-item>
          <n-form-item label="Cilindrada (cc) (*)">
            <n-input-number v-model:value="formData.cilindrada" :min="0" :precision="3" />
          </n-form-item>
          <n-form-item label="Cilindros (*)">
            <n-input-number v-model:value="formData.cilindros" :min="0" />
          </n-form-item>
          <n-form-item label="Altura (m) (*)">
            <n-input-number v-model:value="formData.altura" :min="0" :precision="3" />
          </n-form-item>
          <n-form-item label="Ancho (m) (*)">
            <n-input-number v-model:value="formData.ancho" :min="0" :precision="3" />
          </n-form-item>
          <n-form-item label="Longitud (m) (*)">
            <n-input-number v-model:value="formData.longitud" :min="0" :precision="3" />
          </n-form-item>
        </div>
      </n-card>

      <!-- Acciones -->
      <div class="flex justify-end gap-4 pt-4">
        <n-button type="tertiary" @click="resetForm" :disabled="loading">Limpiar</n-button>
        <n-button type="primary" @click="submitForm" :loading="loading">
          {{ loading ? 'Enviando...' : 'Registrar Vehículo' }}
        </n-button>
      </div>
    </n-form>
  </div>
</template>

<script setup>
import { useVehiculos } from '../../composables/vehiculos/useVehiculos';

const {
  formData,
  loading,
  resetForm,
  submitForm
} = useVehiculos();
</script>