<template>
  <div class="login-container">
    <h2>Iniciar Sesión</h2>
    <form @submit.prevent="handleSubmit">
      <div class="form-group">
        <label for="username">Nombre de usuario:</label>
        <input type="text" id="username" v-model="username" required />
      </div>
      <div class="form-group">
        <label for="password">Contraseña:</label>
        <input type="password" id="password" v-model="password" required />
      </div>
      <div v-if="authStore.loginError" class="error-message">
        {{ authStore.loginError }}
      </div>
      <button type="submit" :disabled="loading">
        {{ loading ? 'Ingresando...' : 'Ingresar' }}
      </button>
    </form>
  </div>
</template>

<script setup>
    import { ref } from 'vue'
    import { useAuthStore } from '../store/auth'

    const authStore = useAuthStore()
    const username = ref('')
    const password = ref('')
    const loading = ref(false)

    const handleSubmit = async () => {
    loading.value = true;
    // Asegúrate que las credenciales coincidan con lo que espera tu backend
    // Para DRF Simple JWT por defecto es 'username' y 'password'.
    // Si usas email, tu User model y el serializer de login de Django deben estar configurados para ello.
    
    await authStore.login({ username: username.value, password: password.value });
    loading.value = false;
    }
</script>

<style scoped>
.login-container {
  max-width: 400px;
  margin: 50px auto;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
.form-group {
  margin-bottom: 15px;
}
.form-group label {
  display: block;
  margin-bottom: 5px;
}
.form-group input {
  width: 100%;
  padding: 8px;
  box-sizing: border-box;
  border: 1px solid #ccc;
  border-radius: 4px;
}
button {
  background-color: #007bff;
  color: white;
  padding: 10px 15px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  width: 100%;
}
button:disabled {
  background-color: #aaa;
}
button:hover:not(:disabled) {
  background-color: #0056b3;
}
.error-message {
  color: red;
  margin-bottom: 15px;
  text-align: center;
}
</style>