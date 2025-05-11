import { createApp } from 'vue'
import { createPinia } from 'pinia' //importamos Pinia
import './style.css'
import App from './App.vue'
import router from './routers' //importamos el archivo de router

//modificaciones para el uso de las importaciones
const app = createApp(App)

app.use(createPinia()) //usamos Pinia
app.use(router)

app.mount('#app')