<template>
  <div class="space-y-8 p-6">
    <!-- Formulario -->
    <section class="bg-white light:bg-neutral-900 rounded-lg shadow p-6 space-y-4">
      <FormularioVehiculo @save="handleSave" @cancel="handleCancel" />
    </section>
  </div>
</template>

<script setup>
import FormularioVehiculo from '../components/vehiculos/FormularioVehiculo.vue';
import { useVehiculos } from '../composables/vehiculos/useVehiculo';

const { handleSave, handleCancel } = useVehiculos();
</script>