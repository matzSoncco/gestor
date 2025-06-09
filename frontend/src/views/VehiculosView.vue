<template>
    <div class="ingreso-datos-view">
        <h1>Registro de Vehículos</h1>
        <section class="form-section">
            <h2>Formulario de Registro para Vehiculos</h2>
            <FormularioVehiculos @datos-enviados="handleDatosEnviados"/>
        </section>
    </div>
</template>

<script setup>
import FormularioVehiculos from '../components/FormularioVehiculo.vue'
import useRegistroVehiculos from '../composables/useVehiculo'
import '../assets/styles/IngresoDatos.css'

// Usar el composable de registro de vehículos
const { registrarVehiculo } = useRegistroVehiculos()

// Manejar los datos enviados desde el formulario
const handleDatosEnviados = (datos) => {
    console.log('Datos recibidos del formulario:', datos)
    // Aquí puedes hacer lo que necesites con los datos
    // Por ejemplo, registrar el vehículo en la base de datos
    registrarVehiculo(datos)
        .then(() => {
            console.log('Vehículo registrado con éxito')
        })
        .catch(error => {
            console.error('Error al registrar vehículo:', error)
        })
}
</script>