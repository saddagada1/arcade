import {
  scores,
  superSpeed,
  tetrominoVariants,
  tetrominoes,
  maxBoardWidth,
  defaultCellSize,
  defaultCellRows,
  maxBoardHeight,
} from "~/utils/tetris/constants";
import { cn, rand } from "~/utils/helpers";
import {
  type TetrominoShapes,
  type Tetromino,
  ScoreLines,
} from "~/utils/tetris/types";
import { useElementSize, useInterval, useWindowSize } from "usehooks-ts";
import { type HTMLAttributes, useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useTetrisContext } from "./context";
import Save from "../save";
import { api } from "~/utils/api";
import { toast } from "sonner";
import { Button } from "../ui/button";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
} from "lucide-react";

interface ScoreBoardProps {
  score: number;
  lines: number;
  shape?: Tetromino;
}

const ScoreBoard: React.FC<ScoreBoardProps> = ({ score, lines, shape }) => {
  return (
    <>
      <div className="flex w-3/5 gap-2 lg:hidden">
        <div className="flex flex-1 flex-col gap-2">
          <div className="flex flex-1 flex-col items-end justify-end border p-2">
            <h1 className="section-label w-full">Score</h1>
            <p className="text-destructive">{score}</p>
          </div>
          <div className="flex items-center justify-between border p-2">
            <h1 className="section-label">Lines</h1>
            <p className="text-sm">{lines}</p>
          </div>
        </div>
        <div className="relative flex flex-1 flex-col items-end justify-end overflow-hidden border p-2">
          <h1 className="section-label w-full">Next Up</h1>
          {!!shape && (
            <RenderTetromino
              className="translate-x-1/4 translate-y-1/4 scale-50"
              tetromino={shape}
            />
          )}
        </div>
      </div>
      <div className="hidden flex-1 gap-2 lg:flex lg:flex-col-reverse">
        <div className="flex flex-1 flex-col items-end justify-end border p-2">
          <h1 className="section-label w-full">Score</h1>
          <p className="text-5xl text-destructive">{score}</p>
        </div>
        <div className="flex flex-1 flex-col gap-2">
          <div className="flex items-center justify-between border p-2">
            <h1 className="section-label">Lines</h1>
            <p className="text-sm">{lines}</p>
          </div>
          <div className="relative flex flex-1 flex-col items-end justify-end overflow-hidden border p-2">
            <h1 className="section-label w-full">Next Up</h1>
            {!!shape && (
              <RenderTetromino
                className="translate-x-1/4 translate-y-1/4 scale-50"
                tetromino={shape}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

interface ControlsProps {
  onPress?: (button: "up" | "down" | "left" | "right") => void;
  onRelease?: (button: "up" | "down" | "left" | "right") => void;
}

const Controls: React.FC<ControlsProps> = ({ onPress, onRelease }) => {
  return (
    <div className="flex w-2/5 flex-col gap-2 lg:hidden">
      <div className="grid grid-cols-3">
        <Button
          onPointerDown={() => onPress && onPress("up")}
          onPointerUp={() => onRelease && onRelease("up")}
          className="col-start-2"
          variant="outline"
          size="icon"
        >
          <ChevronUp strokeWidth={1} />
        </Button>
      </div>
      <div className="grid grid-cols-3">
        <Button
          onPointerDown={() => onPress && onPress("left")}
          onPointerUp={() => onRelease && onRelease("left")}
          variant="outline"
          size="icon"
        >
          <ChevronLeft strokeWidth={1} />
        </Button>
        <Button
          onPointerDown={() => onPress && onPress("right")}
          onPointerUp={() => onRelease && onRelease("right")}
          className="col-start-3"
          variant="outline"
          size="icon"
        >
          <ChevronRight strokeWidth={1} />
        </Button>
      </div>
      <div className="grid grid-cols-3">
        <Button
          onPointerDown={() => onPress && onPress("down")}
          onPointerUp={() => onRelease && onRelease("down")}
          className="col-start-2 select-none"
          variant="outline"
          size="icon"
        >
          <ChevronDown strokeWidth={1} />
        </Button>
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
  const { cellSize } = useTetrisContext();

  const calcXMax = (tetromino: Tetromino) => {
    return (
      (tetromino.shape.reduce((curr, { x }) => (x > curr ? x : curr), 0) + 1) *
      cellSize
    );
  };

  const calcYMax = (tetromino: Tetromino) => {
    return (
      (tetromino.shape.reduce((curr, { y }) => (y > curr ? y : curr), 0) + 1) *
      cellSize
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
              translateX: x * cellSize,
              translateY: y * cellSize,
            }}
            animate={{
              translateX: x * cellSize,
              translateY: y * cellSize,
            }}
            exit={{ opacity: 0 }}
            key={index}
            style={{
              width: cellSize,
              height: cellSize,
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
    cellCols,
    cellRows,
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
    setMessage,
    setAlert,
    setOnFire,
  } = useTetrisContext();

  const calcScore = useCallback(
    (lines: ScoreLines) => {
      if (ScoreLines.four === lines) {
        setMessage("Tetris");
        setAlert(true);
        setOnFire(true);
      } else if (ScoreLines.three === lines || ScoreLines.two === lines) {
        setMessage(ScoreLines.three === lines ? "Triple" : "Double");
        setAlert(true);
      }
      return scores[lines] * (level + 1);
    },
    [level, setAlert, setMessage, setOnFire],
  );

  const calcBlock = useCallback(
    ({
      coordinate,
      offset,
      mod,
    }: {
      coordinate: number;
      offset: number;
      mod?: number;
    }) => {
      return coordinate + (offset + (mod ?? 0));
    },
    [],
  );

  const calcXMax = useCallback((shape: Tetromino["shape"]) => {
    return shape.reduce((curr, { x }) => (x > curr ? x : curr), 0) + 1;
  }, []);

  const calcYMax = useCallback((shape: Tetromino["shape"]) => {
    return shape.reduce((curr, { y }) => (y > curr ? y : curr), 0) + 1;
  }, []);

  const updateHeightMap = useCallback(() => {
    const coordinates = tetromino.shape.map(({ x, y }) => {
      const blockCol = calcBlock({ coordinate: x, offset: xOffset });
      const blockRow = calcBlock({ coordinate: y, offset: yOffset });
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
        x: calcBlock({ coordinate: block.x, offset: xOffset }),
        y: calcBlock({ coordinate: block.y, offset: yOffset }),
      });
    }
    return [{ ...tetromino, shape: update }];
  }, [calcBlock, tetromino, xOffset, yOffset]);

  const clearFilledRows = useCallback(() => {
    const rowArray: number[] = Array.from({ length: cellRows });
    const colArray: number[] = Array.from({ length: cellCols });
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
      if (sum && sum === cellCols) {
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
    cellCols,
    cellRows,
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

  const willCollide = useCallback(
    ({
      x,
      y,
      future,
      mod,
    }: {
      x: number;
      y: number;
      future?: "x" | "y";
      mod?: number;
    }) => {
      const blockCol = calcBlock({
        coordinate: x,
        offset: xOffset,
        mod: future === "x" ? mod : 0,
      });
      const blockRow = calcBlock({
        coordinate: y,
        offset: yOffset,
        mod: future === "y" ? mod : 0,
      });
      const col = heightMap[blockCol];
      if (col === undefined) return false;
      return col[blockRow] === 1;
    },
    [calcBlock, heightMap, xOffset, yOffset],
  );

  const outOfBounds = useCallback(
    ({
      coordinate,
      offset,
      dir,
      mod,
    }: {
      coordinate: number;
      offset: number;
      dir: "zero" | "down" | "right";
      mod?: number;
    }) => {
      if (dir === "down") {
        return calcBlock({ coordinate, offset, mod }) >= cellRows;
      } else if (dir === "right") {
        return calcBlock({ coordinate, offset, mod }) >= cellCols;
      } else {
        return calcBlock({ coordinate, offset, mod }) < 0;
      }
    },
    [calcBlock, cellCols, cellRows],
  );

  const handleVariantChange = useCallback(
    (shape: Tetromino["shape"], variantIndex: number) => {
      let xOverflow = null;
      let yOverflow = null;
      let blocked = false;
      for (const block of shape) {
        if (
          willCollide({
            x: block.x,
            y: block.y,
          })
        ) {
          blocked = true;
          break;
        }
        if (
          outOfBounds({ coordinate: block.x, offset: xOffset, dir: "zero" }) ||
          outOfBounds({ coordinate: block.x, offset: xOffset, dir: "right" })
        ) {
          if (xOffset - block.x < 0) {
            xOverflow = "left";
          } else if (block.x + xOffset >= cellCols) {
            xOverflow = "right";
          }
        }
        if (
          outOfBounds({ coordinate: block.y, offset: yOffset, dir: "zero" }) ||
          outOfBounds({ coordinate: block.y, offset: yOffset, dir: "down" })
        ) {
          if (yOffset - block.y < 0) {
            yOverflow = "up";
          } else if (block.y + yOffset >= cellRows) {
            yOverflow = "down";
          }
        }
      }
      if (blocked) return;
      if (xOverflow ?? yOverflow) {
        if (xOverflow === "left" || yOverflow === "up") {
          if (xOverflow === "left") {
            setXOffset(0);
          }
          if (yOverflow === "up") {
            setYOffset(0);
          }
        } else {
          const xMax = calcXMax(shape);
          const yMax = calcYMax(shape);
          for (const block of shape) {
            if (
              willCollide({
                x: block.x,
                y: block.y,
                future: "x",
                mod: cellCols - (xOffset + xMax),
              }) ||
              willCollide({
                x: block.x,
                y: block.y,
                future: "y",
                mod: cellRows - (yOffset + yMax),
              })
            ) {
              blocked = true;
              break;
            }
          }
          if (blocked) return;
          if (xOverflow === "right") {
            setXOffset(cellCols - xMax);
          }
          if (yOverflow === "down") {
            setYOffset(cellRows - yMax);
          }
        }
      }
      setTetromino({
        ...tetromino,
        shape,
        variant: variantIndex,
      });
    },
    [
      calcXMax,
      calcYMax,
      cellCols,
      cellRows,
      outOfBounds,
      setTetromino,
      setXOffset,
      setYOffset,
      tetromino,
      willCollide,
      xOffset,
      yOffset,
    ],
  );

  const handleMove = useCallback(
    (dir: "left" | "right") => {
      if (dir === "left") {
        let collision = false;
        for (const block of tetromino.shape) {
          if (
            outOfBounds({
              coordinate: block.x,
              offset: xOffset,
              dir: "zero",
              mod: -1,
            }) ||
            willCollide({ x: block.x, y: block.y, future: "x", mod: -1 })
          ) {
            collision = true;
            break;
          }
        }
        if (!collision) {
          setXOffset(xOffset - 1);
        }
      } else {
        let collision = false;
        for (const block of tetromino.shape) {
          if (
            outOfBounds({
              coordinate: block.x,
              offset: xOffset,
              dir: "right",
              mod: 1,
            }) ||
            willCollide({ x: block.x, y: block.y, future: "x", mod: 1 })
          ) {
            collision = true;
            break;
          }
        }
        if (!collision) {
          setXOffset(xOffset + 1);
        }
      }
    },
    [outOfBounds, setXOffset, tetromino, willCollide, xOffset],
  );

  useInterval(
    () => {
      let collision = false;
      for (const block of tetromino.shape) {
        if (
          outOfBounds({
            coordinate: block.y,
            offset: yOffset,
            dir: "down",
            mod: 1,
          }) ||
          willCollide({ x: block.x, y: block.y, future: "y", mod: 1 })
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
    const handleKeyDown = (ev: KeyboardEvent) => {
      if (ev.key === "ArrowLeft") {
        handleMove("left");
      } else if (ev.key === "ArrowRight") {
        handleMove("right");
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
    if (gameOver) return;
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [
    gameOver,
    handleMove,
    handleVariantChange,
    setIsSuperSpeed,
    tetromino,
    tetrominoShape,
  ]);

  if (!gameStarted)
    return (
      <div className="flex flex-1 gap-2">
        <ScoreBoard score={score} lines={lines} />
        <Controls />
      </div>
    );

  return (
    <>
      <RenderTetromino
        key={tetrominoShape}
        tetromino={{
          ...tetromino,
          shape: tetromino.shape.map(({ x, y }) => ({
            x: calcBlock({ coordinate: x, offset: xOffset }),
            y: calcBlock({ coordinate: y, offset: yOffset }),
          })),
        }}
      />
      {placed.map((placedTetromino, index) => (
        <RenderTetromino key={index} tetromino={placedTetromino} />
      ))}
      <div className="flex flex-1 gap-2">
        <ScoreBoard
          score={score}
          lines={lines}
          shape={tetrominoes[futureShape]}
        />
        <Controls
          onPress={(button) => {
            if (button === "left") {
              handleMove("left");
            } else if (button === "right") {
              handleMove("right");
            } else if (button === "down") {
              setIsSuperSpeed(true);
            } else if (button === "up") {
              const variant =
                tetrominoVariants[tetrominoShape][tetromino.variant];
              if (!variant) {
                handleVariantChange(tetrominoes[tetrominoShape].shape, 0);
              } else {
                handleVariantChange(variant.shape, tetromino.variant + 1);
              }
            }
          }}
          onRelease={(button) => {
            if (button === "down") {
              setIsSuperSpeed(false);
            }
          }}
        />
      </div>
    </>
  );
};

const Board: React.FC<{ width: number }> = ({ width }) => {
  const {
    cellSize,
    setCellSize,
    cellCols,
    cellRows,
    setCellRows,
    gameOver,
    score,
    saved,
    setSaved,
  } = useTetrisContext();
  const { width: screenWidth, height: screenHeight } = useWindowSize();
  const t3 = api.useUtils();
  const [askSave, setAskSave] = useState(false);
  const { mutateAsync: save, isLoading: saving } = api.tetris.save.useMutation({
    onSuccess: async () => {
      setSaved(true);
      await t3.tetris.invalidate();
      toast.success("Saved score to your profile.");
    },
    onError: () =>
      toast.error("Failed to save score.", {
        action: {
          label: "Retry",
          onClick: () => {
            toast.loading("Saving...");
            void save({ score });
          },
        },
      }),
  });

  useEffect(() => {
    if (gameOver) {
      if (saved) return;
      setAskSave(true);
    } else {
      setAskSave(false);
      setSaved(false);
    }
  }, [gameOver, saved, setSaved]);

  useEffect(() => {
    if (!screenWidth || !screenHeight) return;

    if (screenWidth < maxBoardWidth) {
      setCellSize(width / cellCols);
      if (screenHeight < maxBoardHeight) {
        setCellRows(defaultCellRows - 10);
      } else {
        setCellRows(defaultCellRows - 5);
      }
    } else {
      setCellSize(defaultCellSize);
      if (screenHeight > maxBoardHeight * 1.5) {
        setCellRows(defaultCellRows + 5);
      }
    }
  }, [cellCols, screenHeight, screenWidth, setCellRows, setCellSize, width]);

  return (
    <>
      <div
        style={{
          width: cellSize * cellCols,
          height: cellSize * cellRows,
          gridTemplateColumns: `repeat(${cellCols}, minmax(0, 1fr))`,
          gridTemplateRows: `repeat(${cellRows}, minmax(0, 1fr))`,
        }}
        className="relative grid w-full border"
      >
        {Array.from({ length: cellCols * cellRows }).map((_, index) => (
          <div
            style={{
              width: cellSize,
              height: cellSize,
            }}
            key={index}
            className={cn(
              index % cellCols !== 0 && "border-l",
              index >= cellCols && "border-t",
            )}
          />
        ))}
        {askSave && (
          <Save
            onSave={async () => {
              await save({ score });
              setAskSave(false);
            }}
            message={saving ? "Save in progress..." : undefined}
            saving={saving}
            automaticSave
            onCancel={() => setAskSave(false)}
            className="absolute z-10 w-5/6 self-center justify-self-center"
          />
        )}
      </div>
    </>
  );
};

const Game: React.FC<HTMLAttributes<HTMLDivElement>> = ({ ...props }) => {
  const [container, { width }] = useElementSize();
  const { className, ...rest } = props;
  return (
    <>
      <div
        {...rest}
        ref={container}
        className={cn("relative flex flex-col gap-2", className)}
      >
        <Board width={width} />
        <RenderTetrominoes />
      </div>
    </>
  );
};

export { RenderTetromino };

export default Game;
