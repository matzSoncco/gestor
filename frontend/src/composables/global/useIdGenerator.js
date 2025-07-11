export function useIdGenerator() {
  // Función para generar IDs únicos
  const generateId = () => `id_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 7)}`;

  return { generateId };
}