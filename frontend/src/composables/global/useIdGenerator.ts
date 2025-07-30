export function useIdGenerator() {
  const generateId = (): string =>
    `id_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`;

  return { generateId };
}