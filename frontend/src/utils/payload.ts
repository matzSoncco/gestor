export const stripTempIds = <T extends { id?: unknown }>(arr: T[]) =>
  arr.map(({ id, ...rest }) =>
    typeof id === 'number' && id > 0 ? ({ id, ...rest }) : rest,
  );