import { ref } from 'vue';

const isAppLoading = ref(false); // Estado reactivo global

export function useAppLoading() {
  const startLoading = () => {
    isAppLoading.value = true;
  };

  const stopLoading = () => {
    isAppLoading.value = false;
  };

  return {
    isAppLoading,
    startLoading,
    stopLoading
  };
}