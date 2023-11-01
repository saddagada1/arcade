export const buildHeightMap = (cellCols: number, cellRows: number) => {
  const colArray: number[] = Array.from({ length: cellCols });
  const rowArray: number[] = Array.from({ length: cellRows });
  return colArray.reduce(
    (obj, _, index) => ({
      ...obj,
      [index]: rowArray.reduce((o, _v, i) => ({ ...o, [i]: 0 }), {}),
    }),
    {} as Record<number, Record<number, number>>,
  );
};
