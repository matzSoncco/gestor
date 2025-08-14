<template>
  <div class="space-y-6">
    <n-page-header 
      title="Registro de Vehículo" 
      subtitle="Registra todos los componentes del vehículo"
    />
    <n-form label-placement="top" class="space-y-6">
      <!-- Sección: Datos Básicos -->
      <n-card title="Datos Básicos del Vehículo" class="shadow-sm">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <n-form-item label="Placa (*)" v-bind="getFormItemProps('placa')">
            <n-input
              v-model:value="formData.placa"
              placeholder="ABC123"
              maxlength="6"
              show-count
              @input="formData.placa = formData.placa.toUpperCase().replace(/[^A-Z0-9]/g, '')"
            />
          </n-form-item>

          <n-form-item label="Año (*)" v-bind="getFormItemProps('anio')">
            <n-input-number v-model:value="formData.anio" :min="1900" :max="2100" placeholder="2020" />
          </n-form-item>

          <n-form-item label="Kilometraje (*)" v-bind="getFormItemProps('kilometraje')">
            <n-input-number v-model:value="formData.kilometraje" :min="0" step="0.1" placeholder="0.0" />
          </n-form-item>

          <n-form-item label="Costo (S/) (*)" v-bind="getFormItemProps('costo')">
            <n-input-number v-model:value="formData.costo" :min="0" :precision="2" placeholder="25000.00" />
          </n-form-item>
        </div>
      </n-card>

      <!-- Sección: Tarjeta del Vehículo -->
      <n-card title="Tarjeta del Vehículo" class="shadow-sm">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <n-form-item label="Ubicación (*)" v-bind="getFormItemProps('ubicacion')">
            <n-input v-model:value="formData.ubicacion" />
          </n-form-item>

          <n-form-item label="Categoría (*)" v-bind="getFormItemProps('categoria')">
            <n-input v-model:value="formData.categoria" />
          </n-form-item>

          <n-form-item label="Marca (*)" v-bind="getFormItemProps('marca')">
            <n-input v-model:value="formData.marca" />
          </n-form-item>

          <n-form-item label="Modelo (*)" v-bind="getFormItemProps('modelo')">
            <n-input v-model:value="formData.modelo" />
          </n-form-item>

          <n-form-item label="Versión (*)" v-bind="getFormItemProps('version')">
            <n-input v-model:value="formData.version" />
          </n-form-item>

          <n-form-item label="Color (*)" v-bind="getFormItemProps('color')">
            <n-input v-model:value="formData.color" />
          </n-form-item>

          <n-form-item label="Año de Fabricación (*)" v-bind="getFormItemProps('anio_fabricacion')">
            <n-input-number v-model:value="formData.anio_fabricacion" :min="1900" :max="2100" />
          </n-form-item>

          <n-form-item label="Año de Modelo (*)" v-bind="getFormItemProps('anio_modelo')">
            <n-input-number v-model:value="formData.anio_modelo" :min="1900" :max="2100" />
          </n-form-item>

          <n-form-item label="Motor (*)" v-bind="getFormItemProps('motor')">
            <n-input v-model:value="formData.motor" />
          </n-form-item>

          <n-form-item label="Combustible (*)" v-bind="getFormItemProps('combustible')">
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

          <n-form-item label="Forma Rodante (*)" v-bind="getFormItemProps('forma_rodante')">
            <n-input v-model:value="formData.forma_rodante" />
          </n-form-item>

          <n-form-item label="VIN (*)" v-bind="getFormItemProps('vin')">
            <n-input
              v-model:value="formData.vin"
              placeholder="17 caracteres (sin I, O, Q)"
              maxlength="17"
              show-count
              @input="formData.vin = formData.vin.toUpperCase().replace(/[^A-HJ-NPR-Z0-9]/g, '')"
            />
          </n-form-item>

          <n-form-item label="Serie de Chasis (*)" v-bind="getFormItemProps('serie_chasis')">
            <n-input v-model:value="formData.serie_chasis" />
          </n-form-item>

          <n-form-item label="Ejes (*)" v-bind="getFormItemProps('ejes')">
            <n-input-number v-model:value="formData.ejes" :min="0" />
          </n-form-item>

          <n-form-item label="Ruedas (*)" v-bind="getFormItemProps('ruedas')">
            <n-input-number v-model:value="formData.ruedas" :min="0" />
          </n-form-item>

          <n-form-item label="Pasajeros (*)" v-bind="getFormItemProps('pasajeros')">
            <n-input-number v-model:value="formData.pasajeros" :min="0" />
          </n-form-item>

          <n-form-item label="Carrocería (*)" v-bind="getFormItemProps('carroceria')">
            <n-input v-model:value="formData.carroceria" />
          </n-form-item>

          <n-form-item label="Peso Neto (kg) (*)" v-bind="getFormItemProps('peso_neto')">
            <n-input-number v-model:value="formData.peso_neto" :min="0" :precision="3" />
          </n-form-item>

          <n-form-item label="Peso Bruto (kg) (*)" v-bind="getFormItemProps('peso_bruto')">
            <n-input-number v-model:value="formData.peso_bruto" :min="0" :precision="3" />
          </n-form-item>

          <n-form-item label="Carga Útil (kg) (*)" v-bind="getFormItemProps('carga_util')">
            <n-input-number v-model:value="formData.carga_util" :min="0" :precision="3" />
          </n-form-item>

          <n-form-item label="Cilindrada (cc) (*)" v-bind="getFormItemProps('cilindrada')">
            <n-input-number v-model:value="formData.cilindrada" :min="0" :precision="3" />
          </n-form-item>

          <n-form-item label="Cilindros (*)" v-bind="getFormItemProps('cilindros')">
            <n-input-number v-model:value="formData.cilindros" :min="0" />
          </n-form-item>

          <n-form-item label="Altura (m) (*)" v-bind="getFormItemProps('altura')">
            <n-input-number v-model:value="formData.altura" :min="0" :precision="3" />
          </n-form-item>

          <n-form-item label="Ancho (m) (*)" v-bind="getFormItemProps('ancho')">
            <n-input-number v-model:value="formData.ancho" :min="0" :precision="3" />
          </n-form-item>

          <n-form-item label="Longitud (m) (*)" v-bind="getFormItemProps('longitud')">
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

<script setup lang="ts">
import { useVehiculos } from '../../composables/vehiculos/useVehiculos';

const {
  formData,
  loading,
  resetForm,
  submitForm,
  formErrors,
} = useVehiculos();

const getFormItemProps = (fieldPath: string, _index?: number, _subfield?: string) => {
  const errorMessages = formErrors.value[fieldPath];
  return {
    validationStatus: errorMessages ? ('error' as const) : undefined,
    feedback: errorMessages ? errorMessages[0] : undefined,
  };
};
</script>