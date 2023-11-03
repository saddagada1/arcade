import {
  type TetrominoShapes,
  type Tetromino,
  type TetrominoVariant,
  type ScoreLines,
} from "./types";

export const highScoresLimit = 10;

export const maxBoardWidth = 400;

export const maxBoardHeight = 800;

export const defaultCellSize = 40;

export const defaultCellCols = 10;

export const defaultCellRows = 20;

export const defaultFallSpeed = 600;

export const superSpeed = 50;

export const controls = [
  { key: "Arrow Up", action: "Morph" },
  { key: "Arrow Down", action: "Accelerate" },
  { key: "Arrow Left", action: "Move Left" },
  { key: "Arrow Right", action: "Move Right" },
];

export const scores: Record<ScoreLines, number> = {
  0: 0,
  1: 40,
  2: 100,
  3: 300,
  4: 1200,
};

export const tetrominoes: Record<TetrominoShapes, Tetromino> = {
  1: {
    shape: [
      { x: 0, y: 0 },
      { x: 1, y: 0 },
      { x: 2, y: 0 },
      { x: 3, y: 0 },
    ],
    colour: "#ef4444",
    variant: 0,
  },
  2: {
    shape: [
      { x: 0, y: 1 },
      { x: 1, y: 1 },
      { x: 2, y: 1 },
      { x: 2, y: 0 },
    ],
    colour: "#f97316",
    variant: 0,
  },
  3: {
    shape: [
      { x: 0, y: 0 },
      { x: 1, y: 0 },
      { x: 2, y: 0 },
      { x: 2, y: 1 },
    ],
    colour: "#eab308",
    variant: 0,
  },
  4: {
    shape: [
      { x: 0, y: 0 },
      { x: 1, y: 0 },
      { x: 0, y: 1 },
      { x: 1, y: 1 },
    ],
    colour: "#22c55e",
    variant: 0,
  },
  5: {
    shape: [
      { x: 0, y: 1 },
      { x: 1, y: 1 },
      { x: 2, y: 1 },
      { x: 1, y: 0 },
    ],
    colour: "#3b82f6",
    variant: 0,
  },
  6: {
    shape: [
      { x: 2, y: 0 },
      { x: 1, y: 0 },
      { x: 1, y: 1 },
      { x: 0, y: 1 },
    ],
    colour: "#a855f7",
    variant: 0,
  },
  7: {
    shape: [
      { x: 0, y: 0 },
      { x: 1, y: 0 },
      { x: 1, y: 1 },
      { x: 2, y: 1 },
    ],
    colour: "#ec4899",
    variant: 0,
  },
};

export const tetrominoVariants: Record<TetrominoShapes, TetrominoVariant[]> = {
  1: [
    {
      shape: [
        { x: 1, y: 0 },
        { x: 1, y: 1 },
        { x: 1, y: 2 },
        { x: 1, y: 3 },
      ],
    },
    {
      shape: [
        { x: 0, y: 1 },
        { x: 1, y: 1 },
        { x: 2, y: 1 },
        { x: 3, y: 1 },
      ],
    },
    {
      shape: [
        { x: 2, y: 0 },
        { x: 2, y: 1 },
        { x: 2, y: 2 },
        { x: 2, y: 3 },
      ],
    },
  ],
  2: [
    {
      shape: [
        { x: 1, y: 1 },
        { x: 1, y: 2 },
        { x: 1, y: 3 },
        { x: 2, y: 3 },
      ],
    },
    {
      shape: [
        { x: 0, y: 1 },
        { x: 0, y: 0 },
        { x: 1, y: 0 },
        { x: 2, y: 0 },
      ],
    },
    {
      shape: [
        { x: 1, y: 1 },
        { x: 1, y: 2 },
        { x: 1, y: 3 },
        { x: 0, y: 1 },
      ],
    },
  ],
  3: [
    {
      shape: [
        { x: 1, y: 0 },
        { x: 1, y: 1 },
        { x: 1, y: 2 },
        { x: 0, y: 2 },
      ],
    },
    {
      shape: [
        { x: 0, y: 0 },
        { x: 0, y: 1 },
        { x: 1, y: 1 },
        { x: 2, y: 1 },
      ],
    },
    {
      shape: [
        { x: 1, y: 0 },
        { x: 1, y: 1 },
        { x: 1, y: 2 },
        { x: 2, y: 0 },
      ],
    },
  ],
  4: [],
  5: [
    {
      shape: [
        { x: 1, y: 0 },
        { x: 1, y: 1 },
        { x: 1, y: 2 },
        { x: 2, y: 1 },
      ],
    },
    {
      shape: [
        { x: 0, y: 1 },
        { x: 1, y: 1 },
        { x: 2, y: 1 },
        { x: 1, y: 2 },
      ],
    },
    {
      shape: [
        { x: 1, y: 0 },
        { x: 1, y: 1 },
        { x: 1, y: 2 },
        { x: 0, y: 1 },
      ],
    },
  ],
  6: [
    {
      shape: [
        { x: 0, y: 0 },
        { x: 0, y: 1 },
        { x: 1, y: 1 },
        { x: 1, y: 2 },
      ],
    },
    {
      shape: [
        { x: 2, y: 1 },
        { x: 1, y: 1 },
        { x: 1, y: 2 },
        { x: 0, y: 2 },
      ],
    },
    {
      shape: [
        { x: 1, y: 0 },
        { x: 1, y: 1 },
        { x: 2, y: 1 },
        { x: 2, y: 2 },
      ],
    },
  ],
  7: [
    {
      shape: [
        { x: 1, y: 0 },
        { x: 1, y: 1 },
        { x: 0, y: 1 },
        { x: 0, y: 2 },
      ],
    },
    {
      shape: [
        { x: 0, y: 1 },
        { x: 1, y: 1 },
        { x: 1, y: 2 },
        { x: 2, y: 2 },
      ],
    },
    {
      shape: [
        { x: 2, y: 0 },
        { x: 2, y: 1 },
        { x: 1, y: 1 },
        { x: 1, y: 2 },
      ],
    },
  ],
};
