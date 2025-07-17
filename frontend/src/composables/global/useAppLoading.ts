import { ref } from 'vue';

const isAppLoading = ref(false); // Estado reactivo global
let justLoggedIn = false // No es reactivo, solo de control

export function useAppLoading() {
  const startLoading = () => {
    isAppLoading.value = true
  }

  const stopLoading = () => {
    isAppLoading.value = false
    justLoggedIn = false // Reinicia el estado después de cada carga
  }

  const markJustLoggedIn = () => {
    justLoggedIn = true
  }

  const shouldShowLoader = () => justLoggedIn

  return {
    isAppLoading,
    startLoading,
    stopLoading,
    markJustLoggedIn,
    shouldShowLoader
  }
}
