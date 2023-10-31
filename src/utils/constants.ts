import {
  type TetrominoShapes,
  type Tetromino,
  type TetrominoVariant,
} from "./types";

export const defaultCellSize = 40;

export const defaultCellCols = 10;

export const defaultCellRows = 20;

export const defaultFallSpeed = 600;

export const tetrominoes: Record<TetrominoShapes, Tetromino> = {
  1: {
    shape: [
      { x: 0, y: 0 },
      { x: defaultCellSize, y: 0 },
      { x: defaultCellSize * 2, y: 0 },
      { x: defaultCellSize * 3, y: 0 },
    ],
    colour: "#ef4444",
    variant: 0,
  },
  2: {
    shape: [
      { x: 0, y: defaultCellSize },
      { x: defaultCellSize, y: defaultCellSize },
      { x: defaultCellSize * 2, y: defaultCellSize },
      { x: defaultCellSize * 2, y: 0 },
    ],
    colour: "#f97316",
    variant: 0,
  },
  3: {
    shape: [
      { x: 0, y: 0 },
      { x: defaultCellSize, y: 0 },
      { x: defaultCellSize * 2, y: 0 },
      { x: defaultCellSize * 2, y: defaultCellSize },
    ],
    colour: "#eab308",
    variant: 0,
  },
  4: {
    shape: [
      { x: 0, y: 0 },
      { x: defaultCellSize, y: 0 },
      { x: 0, y: defaultCellSize },
      { x: defaultCellSize, y: defaultCellSize },
    ],
    colour: "#22c55e",
    variant: 0,
  },
  5: {
    shape: [
      { x: 0, y: defaultCellSize },
      { x: defaultCellSize, y: defaultCellSize },
      { x: defaultCellSize * 2, y: defaultCellSize },
      { x: defaultCellSize, y: 0 },
    ],
    colour: "#3b82f6",
    variant: 0,
  },
  6: {
    shape: [
      { x: defaultCellSize * 2, y: 0 },
      { x: defaultCellSize, y: 0 },
      { x: defaultCellSize, y: defaultCellSize },
      { x: 0, y: defaultCellSize },
    ],
    colour: "#a855f7",
    variant: 0,
  },
  7: {
    shape: [
      { x: 0, y: 0 },
      { x: defaultCellSize, y: 0 },
      { x: defaultCellSize, y: defaultCellSize },
      { x: defaultCellSize * 2, y: defaultCellSize },
    ],
    colour: "#ec4899",
    variant: 0,
  },
};

export const tetrominoVariants: Record<TetrominoShapes, TetrominoVariant[]> = {
  1: [
    {
      shape: [
        { x: defaultCellSize, y: 0 },
        { x: defaultCellSize, y: defaultCellSize },
        { x: defaultCellSize, y: defaultCellSize * 2 },
        { x: defaultCellSize, y: defaultCellSize * 3 },
      ],
    },
    {
      shape: [
        { x: 0, y: defaultCellSize },
        { x: defaultCellSize, y: defaultCellSize },
        { x: defaultCellSize * 2, y: defaultCellSize },
        { x: defaultCellSize * 3, y: defaultCellSize },
      ],
    },
    {
      shape: [
        { x: defaultCellSize * 2, y: 0 },
        { x: defaultCellSize * 2, y: defaultCellSize },
        { x: defaultCellSize * 2, y: defaultCellSize * 2 },
        { x: defaultCellSize * 2, y: defaultCellSize * 3 },
      ],
    },
  ],
  2: [
    {
      shape: [
        { x: defaultCellSize, y: defaultCellSize },
        { x: defaultCellSize, y: defaultCellSize * 2 },
        { x: defaultCellSize, y: defaultCellSize * 3 },
        { x: defaultCellSize * 2, y: defaultCellSize * 3 },
      ],
    },
    {
      shape: [
        { x: 0, y: defaultCellSize },
        { x: 0, y: 0 },
        { x: defaultCellSize, y: 0 },
        { x: defaultCellSize * 2, y: 0 },
      ],
    },
    {
      shape: [
        { x: defaultCellSize, y: defaultCellSize },
        { x: defaultCellSize, y: defaultCellSize * 2 },
        { x: defaultCellSize, y: defaultCellSize * 3 },
        { x: 0, y: defaultCellSize },
      ],
    },
  ],
  3: [
    {
      shape: [
        { x: defaultCellSize, y: 0 },
        { x: defaultCellSize, y: defaultCellSize },
        { x: defaultCellSize, y: defaultCellSize * 2 },
        { x: 0, y: defaultCellSize * 2 },
      ],
    },
    {
      shape: [
        { x: 0, y: 0 },
        { x: 0, y: defaultCellSize },
        { x: defaultCellSize, y: defaultCellSize },
        { x: defaultCellSize * 2, y: defaultCellSize },
      ],
    },
    {
      shape: [
        { x: defaultCellSize, y: 0 },
        { x: defaultCellSize, y: defaultCellSize },
        { x: defaultCellSize, y: defaultCellSize * 2 },
        { x: defaultCellSize * 2, y: 0 },
      ],
    },
  ],
  4: [],
  5: [
    {
      shape: [
        { x: defaultCellSize, y: 0 },
        { x: defaultCellSize, y: defaultCellSize },
        { x: defaultCellSize, y: defaultCellSize * 2 },
        { x: defaultCellSize * 2, y: defaultCellSize },
      ],
    },
    {
      shape: [
        { x: 0, y: defaultCellSize },
        { x: defaultCellSize, y: defaultCellSize },
        { x: defaultCellSize * 2, y: defaultCellSize },
        { x: defaultCellSize, y: defaultCellSize * 2 },
      ],
    },
    {
      shape: [
        { x: defaultCellSize, y: 0 },
        { x: defaultCellSize, y: defaultCellSize },
        { x: defaultCellSize, y: defaultCellSize * 2 },
        { x: 0, y: defaultCellSize },
      ],
    },
  ],
  6: [
    {
      shape: [
        { x: 0, y: 0 },
        { x: 0, y: defaultCellSize },
        { x: defaultCellSize, y: defaultCellSize },
        { x: defaultCellSize, y: defaultCellSize * 2 },
      ],
    },
    {
      shape: [
        { x: defaultCellSize * 2, y: defaultCellSize },
        { x: defaultCellSize, y: defaultCellSize },
        { x: defaultCellSize, y: defaultCellSize * 2 },
        { x: 0, y: defaultCellSize * 2 },
      ],
    },
    {
      shape: [
        { x: defaultCellSize, y: 0 },
        { x: defaultCellSize, y: defaultCellSize },
        { x: defaultCellSize * 2, y: defaultCellSize },
        { x: defaultCellSize * 2, y: defaultCellSize * 2 },
      ],
    },
  ],
  7: [
    {
      shape: [
        { x: defaultCellSize, y: 0 },
        { x: defaultCellSize, y: defaultCellSize },
        { x: 0, y: defaultCellSize },
        { x: 0, y: defaultCellSize * 2 },
      ],
    },
    {
      shape: [
        { x: 0, y: defaultCellSize },
        { x: defaultCellSize, y: defaultCellSize },
        { x: defaultCellSize, y: defaultCellSize * 2 },
        { x: defaultCellSize * 2, y: defaultCellSize * 2 },
      ],
    },
    {
      shape: [
        { x: defaultCellSize * 2, y: 0 },
        { x: defaultCellSize * 2, y: defaultCellSize },
        { x: defaultCellSize, y: defaultCellSize },
        { x: defaultCellSize, y: defaultCellSize * 2 },
      ],
    },
  ],
};
