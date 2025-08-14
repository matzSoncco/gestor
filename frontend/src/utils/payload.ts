export const stripTempIds = <T extends { id?: unknown }>(arr: T[]) =>
  arr.map(({ id, ...rest }) =>
    typeof id === 'number' && id > 0 ? ({ id, ...rest }) : rest,
  );

export const assignTempIds = <T extends object>(arr: T[]): (T & { id: string })[] =>
  arr.map((item, index) => ({
    id: `temp-${Date.now()}-${index}`, // ID único como string
    ...item
  }));
