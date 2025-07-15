import { toRaw, isProxy } from 'vue';

/**
 * Clona profundamente (deep-clone) cualquier valor *reactivo o no*.
 * 1. Si es un Proxy de Vue ⇒ `toRaw` para obtener el objeto real.
 * 2. Intenta `structuredClone` (rápido, conserva Date, Map, Set…).
 * 3. Si falla o no existe ⇒ fallback a JSON.
 */
export const deepClone = <T>(obj: T): T => {
  const source: unknown = isProxy(obj as any) ? toRaw(obj as any) : obj;

  if (typeof structuredClone === 'function') {
    try {
      return structuredClone(source) as T;
    } catch {
      /* ignoramos y caemos al fallback */
    }
  }
  return JSON.parse(JSON.stringify(source)) as T;
};