<template>
  <div class="home-view">
    <h1>Bienvenido a la Aplicación</h1>
    <p>
      Esta es la página principal. Desde aquí puedes navegar a las diferentes
      secciones de la aplicación utilizando el menú superior.
    </p>
    <section class="quick-links">
      <h2>Accesos Rápidos</h2>
      <ul>
        <li>
          <router-link :to="{ name: 'IngresoDatos' }">Ingresar Nuevos Datos</router-link>
        </li>
        <li>
          <router-link :to="{ name: 'Reportes' }">Generar Reportes</router-link>
        </li>
      </ul>
    </section>
  </div>
</template>

<script setup>
// No se necesita lógica específica aquí por ahora
</script>

<style scoped>
.home-view {
  text-align: center;
}
.quick-links {
  margin-top: 30px;
}
.quick-links ul {
  list-style: none;
  padding: 0;
}
.quick-links li {
  margin: 10px 0;
}
.quick-links a {
  display: inline-block;
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  text-decoration: none;
  border-radius: 5px;
}
.quick-links a:hover {
  background-color: #0056b3;
}
</style>