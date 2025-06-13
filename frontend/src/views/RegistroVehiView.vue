<template>
    <div class="ingreso-datos-view">
        <h1>Registro de Vehículos</h1>
        <p>Utiliza el formulario a continuación para registrar un vehículo.</p>

        <section class="form-section">
            <h2>Formulario de Registro de Vehículo</h2>
            <FormularioVehiculo @save="handleSave" @cancel="handleCancel" />
        </section>

        <div v-if="mensajeGlobal" :class="['mensaje-global', tipoMensajeGlobal]">
            {{ mensajeGlobal }}
        </div>
    </div>
</template>

<script setup>
import FormularioVehiculo from '../components/FormularioVehiculo.vue';
import { useVehiculos } from '../composables/useVehiculo';

const { mensajeGlobal, tipoMensajeGlobal, handleSave, handleCancel } = useVehiculos();
</script>