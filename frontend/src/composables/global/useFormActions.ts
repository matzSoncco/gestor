import { ref, Ref, nextTick } from 'vue';
import { deepClone } from '@/utils/clone';
import { omitEmpty } from '@/utils/omit';

/* --------------------------------- Tipos --------------------------------- */
export interface UseFormActionsOptions<T extends object> {
  defaults: T;
  onSubmitService: (payload: Partial<T>) => Promise<unknown>;
  extraComputed?: Record<string, unknown>;
  onResetCallback?: () => void | Promise<void>;
  onSubmitCallback?: (result: unknown) => void | Promise<void>;
}

export interface UseFormActionsReturn<T> {
  formData: Ref<T>;
  loading: Ref<boolean>;
  resetForm: () => Promise<void>;
  submitForm: () => Promise<void>;
  [key: string]: unknown;
}

/* -------------------- Implementación principal -------------------- */
export function useFormActions<T extends object>({
  defaults,
  onSubmitService,
  extraComputed = {},
  onResetCallback,
  onSubmitCallback,
}: UseFormActionsOptions<T>): UseFormActionsReturn<T> {

  const loading  = ref(false);
  const formData = ref<T>(deepClone(defaults)) as Ref<T>;

  const resetForm = async () => {
    Object.assign(formData.value, deepClone(defaults));
    if (onResetCallback) await onResetCallback();
  };

  const submitForm = async () => {
    if (loading.value) return;
    loading.value = true;

    try {
      await nextTick(); // asegura que v-models estén actualizados

      // 1) Validación específica (si existe) se realiza en onSubmitService
      // 2) Limpiamos campos vacíos antes de enviar:
      const payload = omitEmpty(deepClone(formData.value)) as Partial<T>;

      const result = await onSubmitService(payload);

      if (onSubmitCallback) await onSubmitCallback(result);
      await resetForm();
    } catch (err) {
      // Pasas el error hacia arriba si quieres manejarlo en el componente
      //console.error('[useFormActions] submit error:', err);
    } finally {
      loading.value = false;
    }
  };

  return {
    formData,
    loading,
    resetForm,
    submitForm,
    ...extraComputed,
  };
}