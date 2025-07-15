/**
 * Valida campos obligatorios en un objeto.
 * @param data Objeto parcial que representa un formulario.
 * @param requiredKeys Claves que deben estar presentes y no vacías.
 * @param mensajeGlobal Mensaje de error a mostrar si alguno falta.
 * @returns null si todo está bien, o string con mensaje de error.
 */
export function validateRequired<T extends object>(
  data: Partial<T>,
  requiredKeys: (keyof T)[],
  mensajeGlobal = 'Completa los campos obligatorios (*) antes de continuar.',
): string | null {
  for (const key of requiredKeys) {
    const val = data[key];

    if (
      val === undefined ||
      val === null ||
      (typeof val === 'string' && !val.trim())
    ) {
      return mensajeGlobal;
    }
  }

  return null;
}