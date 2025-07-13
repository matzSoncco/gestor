import { ref, Ref } from 'vue';

/* --------------------------------- Tipos --------------------------------- */

export interface UseFormActionsOptions<T extends object> {
  defaults: T;
  /** Servicio que envía el payload al backend */
  onSubmitService: (payload: Partial<T>) => Promise<unknown>;
  /** Computeds o props extra que quieras exponer */
  extraComputed?: Record<string, unknown>;
  /** Callback opcional al resetear */
  onResetCallback?: () => void | Promise<void>;
  /** Callback opcional post-submit */
  onSubmitCallback?: (result: unknown) => void | Promise<void>;
}

export interface UseFormActionsReturn<T> {
  formData: Ref<T>;
  loading: Ref<boolean>;
  resetForm: () => Promise<void>;
  submitForm: () => Promise<void>;
  /* los campos de extraComputed se añaden dinámicamente */
  [key: string]: unknown;
}

/* ------------------------- Implementación principal ------------------------ */

export function useFormActions<T extends object>({
  defaults,
  onSubmitService,
  extraComputed = {},
  onResetCallback,
  onSubmitCallback,
}: UseFormActionsOptions<T>): UseFormActionsReturn<T> {
  /* Estado reactivo */
  const loading  = ref(false);
  const formData = ref<T>({ ...defaults }) as Ref<T>;

  /* Reset */
  const resetForm = async (): Promise<void> => {
    Object.keys(defaults).forEach((k) => {
      // @ts-ignore  ⇢ mutamos dinámicamente las keys
      formData.value[k] = (defaults as any)[k];
    });
    if (onResetCallback) await onResetCallback();
  };

  /* Limpia profundidad mínima de reactividad */
  const cleanReactiveData = <U extends object>(data: U): U =>
    JSON.parse(JSON.stringify(data));

  /* Submit */
  const submitForm = async (): Promise<void> => {
    if (loading.value) return;
    loading.value = true;

    try {
      const cleanFormData = cleanReactiveData(formData.value);

      const payload = Object.fromEntries(
        Object.entries(cleanFormData).filter(
          ([, v]) => v !== '' && v !== null && v !== undefined,
        ),
      ) as Partial<T>;

      const result = await onSubmitService(payload);

      if (onSubmitCallback) await onSubmitCallback(result);
      await resetForm();
    } catch (err) {
      console.error('[useFormActions] submit error:', err);
    } finally {
      loading.value = false;
    }
  };

  /* API pública */
  return {
    formData,
    loading,
    resetForm,
    submitForm,
    ...extraComputed,
  };
}