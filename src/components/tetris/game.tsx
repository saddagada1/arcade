import {
  defaultCellCols,
  defaultCellRows,
  defaultCellSize,
  scores,
  superSpeed,
  tetrominoVariants,
  tetrominoes,
} from "~/utils/tetris/constants";
import { cn, rand } from "~/utils/helpers";
import {
  type TetrominoShapes,
  type Tetromino,
  type ScoreLines,
} from "~/utils/tetris/types";
import { useInterval } from "usehooks-ts";
import { type HTMLAttributes, useCallback, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useTetrisContext } from "./context";

interface ScoreBoardProps {
  score: number;
  lines: number;
  shape?: Tetromino;
}

const ScoreBoard: React.FC<ScoreBoardProps> = ({ score, lines, shape }) => {
  return (
    <div className="flex flex-1 gap-2">
      <div className="flex flex-1 flex-col items-end justify-end border p-2">
        <h1 className="w-full flex-1 font-medium">Score</h1>
        <p className="text-5xl text-destructive">{score}</p>
      </div>
      <div className="flex flex-1 flex-col gap-2">
        <div className="flex items-center justify-between border p-2">
          <h1 className="font-medium">Lines</h1>
          <p className="text-sm">{lines}</p>
        </div>
        <div className="relative flex flex-1 flex-col items-end justify-end overflow-hidden border p-2">
          <h1 className="w-full flex-1 font-medium">Next Up</h1>
          {!!shape && (
            <RenderTetromino
              className="translate-x-1/4 translate-y-1/4 scale-50"
              tetromino={shape}
            />
          )}
        </div>
      </div>
    </div>
  );
};

interface RenderTetrominoProps extends HTMLAttributes<HTMLDivElement> {
  tetromino: Tetromino;
}

const RenderTetromino: React.FC<RenderTetrominoProps> = ({
  tetromino,
  ...props
}) => {
  const { className, style, ...rest } = props;

  const calcXMax = (tetromino: Tetromino) => {
    return (
      (tetromino.shape.reduce((curr, { x }) => (x > curr ? x : curr), 0) + 1) *
      defaultCellSize
    );
  };

  const calcYMax = (tetromino: Tetromino) => {
    return (
      (tetromino.shape.reduce((curr, { y }) => (y > curr ? y : curr), 0) + 1) *
      defaultCellSize
    );
  };

  return (
    <div
      {...rest}
      style={{
        width: calcXMax(tetromino),
        height: calcYMax(tetromino),
        ...style,
      }}
      className={cn("absolute", className)}
    >
      <AnimatePresence>
        {tetromino.shape.map(({ x, y }, index) => (
          <motion.div
            initial={{
              translateX: x * defaultCellSize,
              translateY: y * defaultCellSize,
            }}
            animate={{
              translateX: x * defaultCellSize,
              translateY: y * defaultCellSize,
            }}
            exit={{ opacity: 0 }}
            key={index}
            style={{
              width: defaultCellSize,
              height: defaultCellSize,
              backgroundColor: tetromino.colour + "CC",
              borderColor: tetromino.colour,
            }}
            className="absolute border"
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

const RenderTetrominoes: React.FC = () => {
  const {
    gameStarted,
    gameOver,
    setGameOver,
    isPlaying,
    setIsPlaying,
    fallSpeed,
    xOffset,
    setXOffset,
    yOffset,
    setYOffset,
    tetrominoShape,
    setTetrominoShape,
    tetromino,
    setTetromino,
    futureShape,
    setFutureShape,
    placed,
    setPlaced,
    heightMap,
    setHeightMap,
    isSuperSpeed,
    setIsSuperSpeed,
    score,
    setScore,
    level,
    lines,
    setLines,
  } = useTetrisContext();

  const calcScore = useCallback(
    (lines: ScoreLines) => {
      return scores[lines] * (level + 1);
    },
    [level],
  );

  const calcBlock = useCallback(
    (coordinate: number, offset: number, mod = 0) => {
      return coordinate + (offset + mod);
    },
    [],
  );

  const updateHeightMap = useCallback(() => {
    const coordinates = tetromino.shape.map(({ x, y }) => {
      const blockCol = calcBlock(x, xOffset);
      const blockRow = calcBlock(y, yOffset);
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
  }, [calcBlock, heightMap, tetromino, xOffset, yOffset]);

  const updatePlaced = useCallback(() => {
    const update: Tetromino["shape"] = [];
    for (const block of tetromino.shape) {
      update.push({
        x: calcBlock(block.x, xOffset),
        y: calcBlock(block.y, yOffset),
      });
    }
    return [{ ...tetromino, shape: update }];
  }, [calcBlock, tetromino, xOffset, yOffset]);

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
    const rowsToClear = rowArray.reduce((arr, _, index) => {
      const sum = rowMap[index];
      if (sum && sum === defaultCellCols) {
        return [...arr, index];
      }
      return arr;
    }, [] as number[]);
    let placedUpdate = [...placed, ...updatePlaced()];
    setXOffset(0);
    setYOffset(0);
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
                [i]: col[i - 1] ?? 0,
              };
            }
            return { ...o, [i]: col[i] ?? 0 };
          }, {}),
        }),
        heightMapUpdate,
      );
    }
    setScore((curr) => curr + calcScore(rowsToClear.length as ScoreLines));
    setLines((curr) => curr + rowsToClear.length);
    setPlaced(placedUpdate);
    setHeightMap(heightMapUpdate);
    setTetrominoShape(futureShape);
    setTetromino(tetrominoes[futureShape]);
    setFutureShape(rand(1, 7) as TetrominoShapes);
  }, [
    calcScore,
    futureShape,
    heightMap,
    placed,
    setFutureShape,
    setHeightMap,
    setLines,
    setPlaced,
    setScore,
    setTetromino,
    setTetrominoShape,
    setXOffset,
    setYOffset,
    updateHeightMap,
    updatePlaced,
  ]);

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
      const blockCol = calcBlock(x, xOffset);
      const blockRow = calcBlock(
        y,
        yOffset,
        present ? 0 : dir === "down" ? 1 : -1,
      );
      const col = heightMap[blockCol];
      if (col === undefined) return false;
      return col[blockRow] === 1;
    },
    [calcBlock, heightMap, xOffset, yOffset],
  );

  const yOutOfBounds = useCallback(
    (y: number, dir: "up" | "down", present?: boolean) => {
      if (dir === "down") {
        return calcBlock(y, yOffset, present ? 0 : 1) >= defaultCellRows;
      } else {
        return calcBlock(y, yOffset, present ? 0 : -1) < 0;
      }
    },
    [calcBlock, yOffset],
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
      const blockCol = calcBlock(
        x,
        xOffset,
        present ? 0 : dir === "right" ? 1 : -1,
      );
      const blockRow = calcBlock(y, yOffset);
      const col = heightMap[blockCol];
      if (col === undefined) return false;
      return col[blockRow] === 1;
    },
    [calcBlock, heightMap, xOffset, yOffset],
  );

  const xOutOfBounds = useCallback(
    (x: number, dir: "left" | "right", present?: boolean) => {
      if (dir === "right") {
        return calcBlock(x, xOffset, present ? 0 : 1) >= defaultCellCols;
      } else {
        return calcBlock(x, xOffset, present ? 0 : -1) < 0;
      }
    },
    [calcBlock, xOffset],
  );
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
        if (isSuperSpeed) {
          setScore((curr) => curr + 1);
        }
      } else {
        if (yOffset > 0) {
          clearFilledRows();
        } else {
          setGameOver(true);
          setIsPlaying(false);
        }
      }
    },
    gameOver || !isPlaying ? null : isSuperSpeed ? superSpeed : fallSpeed,
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
          yWillCollide({
            x: block.x,
            y: block.y,
            dir: "down",
            present: true,
          })
          //   || yOutOfBounds(block.y, "up", true) || ## enable if you want to restrict top overflow
          //   yWillCollide({ x: block.x, y: block.y, dir: "up", present: true })
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
        setIsSuperSpeed(true);
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
        setIsSuperSpeed(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [
    calcBlock,
    calcBlock,
    heightMap,
    setIsSuperSpeed,
    setTetromino,
    setXOffset,
    setYOffset,
    tetromino,
    tetrominoShape,
    xOffset,
    xOutOfBounds,
    xWillCollide,
    yOffset,
    yOutOfBounds,
    yWillCollide,
  ]);

  if (!gameStarted) return <ScoreBoard score={score} lines={lines} />;

  return (
    <>
      <RenderTetromino
        key={tetrominoShape}
        tetromino={{
          ...tetromino,
          shape: tetromino.shape.map(({ x, y }) => ({
            x: calcBlock(x, xOffset),
            y: calcBlock(y, yOffset),
          })),
        }}
      />
      {placed.map((placedTetromino, index) => (
        <RenderTetromino key={index} tetromino={placedTetromino} />
      ))}
      <ScoreBoard
        score={score}
        lines={lines}
        shape={tetrominoes[futureShape]}
      />
    </>
  );
};

const Board: React.FC = () => {
  return (
    <>
      <div
        style={{
          gridTemplateColumns: `repeat(${defaultCellCols}, minmax(0, 1fr))`,
          gridTemplateRows: `repeat(${defaultCellRows}, minmax(0, 1fr))`,
        }}
        className="grid border"
      >
        {Array.from({ length: 200 }).map((_, index) => (
          <div
            style={{
              width: defaultCellSize,
              height: defaultCellSize,
            }}
            key={index}
            className={cn(
              index % defaultCellCols !== 0 && "border-l",
              index >= defaultCellCols && "border-t",
            )}
          />
        ))}
      </div>
    </>
  );
};

const Game: React.FC<HTMLAttributes<HTMLDivElement>> = ({ ...props }) => {
  const { className, ...rest } = props;
  return (
    <>
      <div {...rest} className={cn("relative flex flex-col gap-2", className)}>
        <Board />
        <RenderTetrominoes />
      </div>
    </>
  );
};
export default Game;
