<template>
  <div id="app-container">
    <header v-if="authStore.isAuthenticated">
      <nav>
        <router-link to="/">Inicio</router-link> |
        <router-link to="/ingreso-datos">Ingreso de Datos</router-link> |
        <router-link to="/reportes">Reportes</router-link>
        <button @click="handleLogout" class="logout-button">Cerrar Sesión ({{ authStore.currentUser?.email }})</button>
      </nav>
    </header>
    <main>
      <router-view />
    </main>
  </div>
</template>

<script setup>
import { RouterLink, RouterView } from 'vue-router'
import { useAuthStore } from './store/auth'

const authStore = useAuthStore()

const handleLogout = () => {
  authStore.logout()
}
</script>

<style scoped>
#app-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  font-family: Arial, sans-serif;
}

header {
  background-color: #333;
  color: white;
  padding: 1rem;
  text-align: center;
}

nav a {
  color: white;
  margin: 0 10px;
  text-decoration: none;
}

nav a.router-link-exact-active {
  font-weight: bold;
  text-decoration: underline;
}

.logout-button {
  background-color: #d9534f;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  margin-left: 20px;
}
.logout-button:hover {
  background-color: #c9302c;
}

main {
  flex-grow: 1;
  padding: 20px;
  max-width: 900px;
  margin: 0 auto;
  width: 100%;
}
</style>