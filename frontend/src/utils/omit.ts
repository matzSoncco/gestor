export function omitEmpty<T extends Record<string, any>>(obj: T): Partial<T> {
  const filtered = Object.fromEntries(
    Object.entries(obj).filter(([, v]) => v !== '' && v !== null && v !== undefined)
  );
  return filtered as Partial<T>;
}