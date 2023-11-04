import {
  type Dispatch,
  type SetStateAction,
  createContext,
  useContext,
  useState,
  useEffect,
} from "react";
import { api } from "~/utils/api";
import { rand } from "~/utils/helpers";
import {
  defaultCellCols,
  defaultCellRows,
  defaultFallSpeed,
  highScoresLimit,
  tetrominoes,
} from "~/utils/tetris/constants";
import { buildHeightMap } from "~/utils/tetris/helpers";
import { type Tetromino, type TetrominoShapes } from "~/utils/tetris/types";

export interface TetrisValues {
  cellSize: number;
  setCellSize: Dispatch<SetStateAction<number>>;
  cellCols: number;
  setCellCols: Dispatch<SetStateAction<number>>;
  cellRows: number;
  setCellRows: Dispatch<SetStateAction<number>>;
  gameStarted: boolean;
  setGameStarted: Dispatch<SetStateAction<boolean>>;
  gameOver: boolean;
  setGameOver: Dispatch<SetStateAction<boolean>>;
  isPlaying: boolean;
  setIsPlaying: Dispatch<SetStateAction<boolean>>;
  fallSpeed: number;
  setFallSpeed: Dispatch<SetStateAction<number>>;
  xOffset: number;
  setXOffset: Dispatch<SetStateAction<number>>;
  yOffset: number;
  setYOffset: Dispatch<SetStateAction<number>>;
  tetrominoShape: TetrominoShapes;
  setTetrominoShape: Dispatch<SetStateAction<TetrominoShapes>>;
  tetromino: Tetromino;
  setTetromino: Dispatch<SetStateAction<Tetromino>>;
  futureShape: TetrominoShapes;
  setFutureShape: Dispatch<SetStateAction<TetrominoShapes>>;
  placed: Tetromino[];
  setPlaced: Dispatch<SetStateAction<Tetromino[]>>;
  heightMap: Record<number, Record<number, number>>;
  setHeightMap: Dispatch<
    SetStateAction<Record<number, Record<number, number>>>
  >;
  isSuperSpeed: boolean;
  setIsSuperSpeed: Dispatch<SetStateAction<boolean>>;
  score: number;
  setScore: Dispatch<SetStateAction<number>>;
  lines: number;
  setLines: Dispatch<SetStateAction<number>>;
  level: number;
  setLevel: Dispatch<SetStateAction<number>>;
  message: string | null;
  setMessage: Dispatch<SetStateAction<string | null>>;
  alert: boolean;
  setAlert: Dispatch<SetStateAction<boolean>>;
  onFire: boolean;
  setOnFire: Dispatch<SetStateAction<boolean>>;
  saved: boolean;
  setSaved: Dispatch<SetStateAction<boolean>>;
  startGame: () => void;
  replay: () => void;
}

const TetrisContext = createContext<TetrisValues>(null!);

interface TetrisProviderProps {
  children: React.ReactNode;
}

const TetrisProvider: React.FC<TetrisProviderProps> = ({ children }) => {
  const [cellSize, setCellSize] = useState(0);
  const [cellCols, setCellCols] = useState(defaultCellCols);
  const [cellRows, setCellRows] = useState(defaultCellRows);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [fallSpeed, setFallSpeed] = useState(defaultFallSpeed);
  const [xOffset, setXOffset] = useState(0);
  const [yOffset, setYOffset] = useState(0);
  const [tetrominoShape, setTetrominoShape] = useState(
    rand(1, 7) as TetrominoShapes,
  );
  const [tetromino, setTetromino] = useState(tetrominoes[tetrominoShape]);
  const [futureShape, setFutureShape] = useState(rand(1, 7) as TetrominoShapes);
  const [placed, setPlaced] = useState<Tetromino[]>([]);
  const [heightMap, setHeightMap] = useState(
    buildHeightMap(defaultCellCols, defaultCellRows),
  );
  const [isSuperSpeed, setIsSuperSpeed] = useState(false);
  const [score, setScore] = useState(0);
  const [lines, setLines] = useState(0);
  const [level, setLevel] = useState(0);
  const [message, setMessage] = useState<string | null>(null);
  const [alert, setAlert] = useState(false);
  const [onFire, setOnFire] = useState(false);
  const [saved, setSaved] = useState(false);
  const t3 = api.useUtils();

  const startGame = () => {
    setGameStarted(true);
    setIsPlaying(true);
  };

  const replay = () => {
    const shape = rand(1, 7) as TetrominoShapes;
    setXOffset(0);
    setYOffset(0);
    setTetrominoShape(shape);
    setTetromino(tetrominoes[shape]);
    setFutureShape(rand(1, 7) as TetrominoShapes);
    setPlaced([]);
    setHeightMap(buildHeightMap(defaultCellCols, defaultCellRows));
    setIsSuperSpeed(false);
    setScore(0);
    setLines(0);
    setLevel(0);
    setMessage(null);
    setAlert(false);
    setOnFire(false);
    setGameOver(false);
    setIsPlaying(true);
  };

  useEffect(() => {
    const update = Math.floor(lines / 10);
    if (update > level) {
      if (update > 15) {
        setOnFire(true);
      } else {
        setAlert(true);
      }

      if (fallSpeed > 150) {
        setFallSpeed(fallSpeed - 50);
      }
    }

    setLevel(update);
  }, [lines, level, fallSpeed]);

  useEffect(() => {
    let clearAlert: NodeJS.Timeout;
    if (alert && !gameOver) {
      clearAlert = setTimeout(() => {
        setAlert(false);
        if (message) {
          setMessage(null);
        }
        if (onFire) {
          setOnFire(false);
        }
      }, 5000);
    }
    return () => {
      clearTimeout(clearAlert);
    };
  }, [alert, gameOver, message, onFire]);

  useEffect(() => {
    if (gameOver) {
      const records = t3.tetris.getHighScores.getData({ take: highScoresLimit })
        ?.allTime;
      const highScore = t3.tetris.getUserHighScores.getData()?.highScore;
      if (records?.every(({ highScore: recordScore }) => score > recordScore)) {
        setMessage("New All Time Record");
        setOnFire(true);
      } else if (highScore && score > highScore) {
        setMessage("New High Score");
        setOnFire(true);
      } else {
        setMessage("Game Over");
        setAlert(true);
      }
    }
  }, [gameOver, score, t3]);

  return (
    <TetrisContext.Provider
      value={{
        cellSize,
        setCellSize,
        cellCols,
        setCellCols,
        cellRows,
        setCellRows,
        gameStarted,
        setGameStarted,
        gameOver,
        setGameOver,
        isPlaying,
        setIsPlaying,
        fallSpeed,
        setFallSpeed,
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
        lines,
        setLines,
        level,
        setLevel,
        message,
        setMessage,
        alert,
        setAlert,
        onFire,
        setOnFire,
        saved,
        setSaved,
        startGame,
        replay,
      }}
    >
      {children}
    </TetrisContext.Provider>
  );
};

export const useTetrisContext = () => useContext(TetrisContext);

export default TetrisProvider;
