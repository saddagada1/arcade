import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const rand = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

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
