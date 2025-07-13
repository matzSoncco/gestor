import { createApp } from 'vue'
import { createPinia } from 'pinia' //importamos Pinia
import '@/assets/tailwind.css' //importamos Tailwind CSS
import App from './App.vue'
import naive from 'naive-ui';
import router from '@/routers/index' //importamos el archivo de router

//modificaciones para el uso de las importaciones
const app = createApp(App)

app.use(createPinia()) //usamos Pinia
app.use(router)
app.use(naive); //usamos Naive UI

app.mount('#app')