export enum TetrominoShapes {
  "straight" = 1,
  "l" = 2,
  "j" = 3,
  "square" = 4,
  "t" = 5,
  "s" = 6,
  "z" = 7,
}

export interface TetrominoShape {
  x: number;
  y: number;
}

export interface Tetromino {
  shape: TetrominoShape[];
  colour: string;
  variant: number;
}

export interface TetrominoVariant {
  shape: TetrominoShape[];
}

export enum ScoreLines {
  "zero" = 0,
  "one" = 1,
  "two" = 2,
  "three" = 3,
  "four" = 4,
}
