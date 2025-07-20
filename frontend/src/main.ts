import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPersistedstate from 'pinia-plugin-persistedstate'
import '@/assets/tailwind.css'
import App from './App.vue'
import router from '@/routers/index'
import { useAuthStore } from '@/stores/auth'

const app = createApp(App)
const pinia = createPinia()

pinia.use(piniaPersistedstate)

app.use(pinia)
app.use(router)

app.mount('#app')

// 🔑 Inicializar estado de sesión
const auth = useAuthStore()
auth.initializeAuth()