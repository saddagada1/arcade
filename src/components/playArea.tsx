import {
  defaultCellCols,
  defaultCellRows,
  defaultCellSize,
  defaultFallSpeed,
  tetrominoVariants,
  tetrominoes,
} from "~/utils/constants";
import Board from "./board";
import { buildHeightMap, rand } from "~/utils/helpers";
import { type TetrominoShapes, type Tetromino } from "~/utils/types";
import { useInterval } from "usehooks-ts";
import { useCallback, useEffect, useState } from "react";

interface RenderTetrominoProps {
  tetromino: Tetromino;
}

const RenderTetromino: React.FC<RenderTetrominoProps> = ({ tetromino }) => {
  return (
    <div className="absolute top-0">
      {tetromino.shape.map(({ x, y }, index) => (
        <div
          key={index}
          style={{
            transform: `translateX(${x * defaultCellSize}px) translateY(${
              y * defaultCellSize
            }px)`,
            width: defaultCellSize,
            height: defaultCellSize,
            backgroundColor: tetromino.colour,
          }}
          className="absolute border"
        />
      ))}
    </div>
  );
};

const RenderTetrominoes: React.FC = () => {
  const [fallSpeed, setFallSpeed] = useState(defaultFallSpeed);
  const [xOffset, setXOffset] = useState(0);
  const [yOffset, setYOffset] = useState(0);
  const [hasCollision, setHasCollision] = useState(false);
  const [tetrominoShape, setTetrominoShape] = useState(
    rand(1, 7) as TetrominoShapes,
  );
  const [tetromino, setTetromino] = useState(tetrominoes[tetrominoShape]);
  const [placed, setPlaced] = useState<Tetromino[]>([]);
  const [heightMap, setHeightMap] = useState(
    buildHeightMap(defaultCellCols, defaultCellRows),
  );
  const [gameOver, setGameOver] = useState(false);

  const calcBlockCol = useCallback(
    (x: number, mod = 0) => {
      return (x + (xOffset + mod) * defaultCellSize) / defaultCellSize;
    },
    [xOffset],
  );

  const calcBlockRow = useCallback(
    (y: number, mod = 0) => {
      return (y + (yOffset + mod) * defaultCellSize) / defaultCellSize;
    },
    [yOffset],
  );

  const updateHeightMap = useCallback(() => {
    const coordinates = tetromino.shape.map(({ x, y }) => {
      const blockCol = calcBlockCol(x);
      const blockRow = calcBlockRow(y);
      return { x: blockCol, y: blockRow };
    });
    const update = coordinates.reduce(
      (obj, { x, y }) => {
        const curr = obj[x];
        if (curr) {
          return {
            ...obj,
            [x]: {
              ...curr,
              [y]: 1,
            },
          };
        }
        return {
          ...obj,
          [x]: {
            ...heightMap[x],
            [y]: 1,
          },
        };
      },
      {} as typeof heightMap,
    );
    return update;
  }, [calcBlockCol, calcBlockRow, heightMap, tetromino]);

  const updatePlaced = useCallback(() => {
    const update: Tetromino["shape"] = [];
    for (const block of tetromino.shape) {
      update.push({
        x: calcBlockCol(block.x),
        y: calcBlockRow(block.y),
      });
    }
    return [{ ...tetromino, shape: update }];
  }, [calcBlockCol, calcBlockRow, tetromino]);

  const clearFilledRows = useCallback(() => {
    const rowArray: number[] = Array.from({ length: defaultCellRows });
    const colArray: number[] = Array.from({ length: defaultCellCols });
    let heightMapUpdate = { ...heightMap, ...updateHeightMap() };
    const rowMap = rowArray.reduce(
      (obj, _, index) => ({
        ...obj,
        [index]: colArray.reduce((sum, _v, i) => {
          const col = heightMapUpdate[i];
          if (col === undefined) throw Error("err");
          const row = col[index];
          if (row === undefined) throw Error("err");
          return sum + row;
        }, 0),
      }),
      {} as Record<number, number>,
    );
    console.log(rowMap);
    const rowsToClear = rowArray.reduce((arr, _, index) => {
      const sum = rowMap[index];
      if (sum && sum === defaultCellCols) {
        return [...arr, index];
      }
      return arr;
    }, [] as number[]);
    let placedUpdate = [...placed, ...updatePlaced()];
    for (const row of rowsToClear) {
      placedUpdate = placedUpdate.map((t) => ({
        ...t,
        shape: t.shape
          .filter(({ y }) => y !== row)
          .map(({ x, y }) => (y < row ? { x, y: y + 1 } : { x, y })),
      }));
      heightMapUpdate = colArray.reduce(
        (obj, _, index) => ({
          ...obj,
          [index]: rowArray.reduce((o, _v, i) => {
            const col = heightMapUpdate[index];
            if (col === undefined) throw Error("err");
            if (i <= row) {
              return {
                ...o,
                [i]: col[i - rowsToClear.length] ?? 0,
              };
            }
            return { ...o, [i]: col[i] ?? 0 };
          }, {}),
        }),
        heightMapUpdate,
      );
      console.log(heightMapUpdate);
    }
    setPlaced(placedUpdate);
    setHeightMap(heightMapUpdate);
  }, [heightMap, placed, updateHeightMap, updatePlaced]);

  const yWillCollide = useCallback(
    ({
      x,
      y,
      dir,
      present,
    }: {
      x: number;
      y: number;
      dir: "up" | "down";
      present?: boolean;
    }) => {
      const blockCol = calcBlockCol(x);
      const blockRow = calcBlockRow(y, present ? 0 : dir === "down" ? 1 : -1);
      const col = heightMap[blockCol];
      if (col === undefined) return false;
      return col[blockRow] === 1;
    },
    [calcBlockCol, calcBlockRow, heightMap],
  );

  const yOutOfBounds = useCallback(
    (y: number, dir: "up" | "down", present?: boolean) => {
      if (dir === "down") {
        return calcBlockRow(y, present ? 0 : 1) >= defaultCellRows;
      } else {
        return calcBlockRow(y, present ? 0 : -1) < 0;
      }
    },
    [calcBlockRow],
  );

  const xWillCollide = useCallback(
    ({
      x,
      y,
      dir,
      present,
    }: {
      x: number;
      y: number;
      dir: "left" | "right";
      present?: boolean;
    }) => {
      const blockCol = calcBlockCol(x, present ? 0 : dir === "right" ? 1 : -1);
      const blockRow = calcBlockRow(y);
      const col = heightMap[blockCol];
      if (col === undefined) return false;
      return col[blockRow] === 1;
    },
    [calcBlockCol, calcBlockRow, heightMap],
  );

  const xOutOfBounds = useCallback(
    (x: number, dir: "left" | "right", present?: boolean) => {
      if (dir === "right") {
        return calcBlockCol(x, present ? 0 : 1) >= defaultCellCols;
      } else {
        return calcBlockCol(x, present ? 0 : -1) < 0;
      }
    },
    [calcBlockCol],
  );

  useEffect(() => {
    const newShape = rand(1, 7) as TetrominoShapes;
    setTetrominoShape(newShape);
    setTetromino(tetrominoes[newShape]);
    setXOffset(0);
    setYOffset(0);
    setHasCollision(false);
  }, [placed]);

  useInterval(
    () => {
      let collision = false;
      for (const block of tetromino.shape) {
        if (
          yOutOfBounds(block.y, "down") ||
          yWillCollide({ x: block.x, y: block.y, dir: "down" })
        ) {
          collision = true;
          break;
        }
      }
      if (!collision) {
        setYOffset(yOffset + 1);
      } else {
        if (yOffset > 0) {
          clearFilledRows();
          setHasCollision(true);
        } else {
          setHasCollision(true);
          setGameOver(true);
          alert("game over");
        }
      }
    },
    !hasCollision ? fallSpeed : null,
  );

  useEffect(() => {
    const handleVariantChange = (
      shape: Tetromino["shape"],
      variantIndex: number,
    ) => {
      let width = 0;
      let xCollision = false;
      for (const block of shape) {
        if (
          xOutOfBounds(block.x, "left", true) ||
          xOutOfBounds(block.x, "right", true) ||
          xWillCollide({
            x: block.x,
            y: block.y,
            dir: "left",
            present: true,
          }) ||
          xWillCollide({ x: block.x, y: block.y, dir: "right", present: true })
        ) {
          if (block.x > width) {
            width = block.x;
          }
          xCollision = true;
        }
      }
      if (xCollision) {
        if (xOffset - width / defaultCellSize <= 0) {
          setXOffset(0);
        } else {
          setXOffset(xOffset - width / defaultCellSize);
        }
      }
      let height = 0;
      let yCollision = false;
      for (const block of shape) {
        if (
          yOutOfBounds(block.y, "down", true) ||
          yOutOfBounds(block.y, "up", true) ||
          yWillCollide({
            x: block.x,
            y: block.y,
            dir: "down",
            present: true,
          }) ||
          yWillCollide({ x: block.x, y: block.y, dir: "up", present: true })
        ) {
          if (block.y > height) {
            height = block.y;
          }
          yCollision = true;
        }
      }
      if (yCollision) {
        if (yOffset - height / defaultCellSize <= 0) {
          setYOffset(0);
        } else {
          setYOffset(yOffset - height / defaultCellSize);
        }
      }
      setTetromino({
        ...tetromino,
        shape,
        variant: variantIndex,
      });
    };

    const handleKeyDown = (ev: KeyboardEvent) => {
      if (ev.key === "ArrowLeft") {
        let collision = false;
        for (const block of tetromino.shape) {
          if (
            xOutOfBounds(block.x, "left") ||
            xWillCollide({ x: block.x, y: block.y, dir: "left" })
          ) {
            collision = true;
            break;
          }
        }
        if (!collision) {
          setXOffset(xOffset - 1);
        }
      } else if (ev.key === "ArrowRight") {
        let collision = false;
        for (const block of tetromino.shape) {
          if (
            xOutOfBounds(block.x, "right") ||
            xWillCollide({ x: block.x, y: block.y, dir: "right" })
          ) {
            collision = true;
            break;
          }
        }
        if (!collision) {
          setXOffset(xOffset + 1);
        }
      } else if (ev.key === "ArrowDown") {
        setFallSpeed(defaultFallSpeed / 4);
      } else if (ev.key === "ArrowUp") {
        if (ev.repeat) return;
        const variant = tetrominoVariants[tetrominoShape][tetromino.variant];
        if (!variant) {
          handleVariantChange(tetrominoes[tetrominoShape].shape, 0);
        } else {
          handleVariantChange(variant.shape, tetromino.variant + 1);
        }
      }
    };

    const handleKeyUp = (ev: KeyboardEvent) => {
      if (ev.key === "ArrowDown") {
        setFallSpeed(defaultFallSpeed);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [
    calcBlockCol,
    calcBlockRow,
    heightMap,
    tetromino,
    tetrominoShape,
    xOffset,
    xOutOfBounds,
    xWillCollide,
    yOffset,
    yOutOfBounds,
    yWillCollide,
  ]);

  return (
    <>
      <RenderTetromino
        tetromino={{
          ...tetromino,
          shape: tetromino.shape.map(({ x, y }) => ({
            x: calcBlockCol(x),
            y: calcBlockRow(y),
          })),
        }}
      />
      {placed.map((placedTetromino, index) => (
        <RenderTetromino key={index} tetromino={placedTetromino} />
      ))}
    </>
  );
};

const PlayArea: React.FC = ({}) => {
  return (
    <>
      <div className="relative">
        <Board />
        <RenderTetrominoes />
      </div>
    </>
  );
};
export default PlayArea;
