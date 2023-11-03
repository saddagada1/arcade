import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import { useState } from "react";
import { useInterval } from "usehooks-ts";
import { RenderTetromino } from "~/components/tetris/game";
import { Button } from "~/components/ui/button";
import { library } from "~/utils/constants";
import { rand } from "~/utils/helpers";
import { tetrominoes } from "~/utils/tetris/constants";
import { type Tetromino, type TetrominoShapes } from "~/utils/tetris/types";
import { type Game } from "~/utils/types";

interface GameCardProps {
  game: Game;
  children?: React.ReactNode;
  disabled?: boolean;
}

const GameCard: React.FC<GameCardProps> = ({ game, children, disabled }) => {
  const router = useRouter();
  return (
    <Button
      onClick={() => void router.push(game.href)}
      variant="outline"
      disabled={disabled}
      className="relative h-fit flex-col items-start overflow-hidden whitespace-normal border bg-background p-2 text-left text-sm font-normal"
    >
      <h1 className="h1">
        <span className="font-thin text-destructive">
          {(game.id / 100).toString().replace(".", "")}&nbsp;
        </span>
        {game.name}
      </h1>
      <p className="mb-16 w-2/3 flex-1 text-base font-medium">
        {game.description}
      </p>
      <div className="flex gap-2">
        <p>{game.engine}</p>|<p>{game.status}</p>|<p>{game.date}</p>
      </div>
      {children}
    </Button>
  );
};

const Index: NextPage = ({}) => {
  const [tetromino, setTetromino] = useState<Tetromino>(
    tetrominoes[rand(1, 7) as TetrominoShapes],
  );

  useInterval(() => {
    setTetromino(tetrominoes[rand(1, 7) as TetrominoShapes]);
  }, 2000);
  return (
    <>
      <Head>
        <title>Arcade</title>
      </Head>
      <main className="grid gap-2 lg:grid-cols-3">
        <GameCard game={library.tetris}>
          <RenderTetromino tetromino={tetromino} className="bottom-4 right-4" />
        </GameCard>
        <GameCard game={library.pokemon}>
          <Image
            unoptimized
            src="/media/pokemon.gif"
            alt="squirtle"
            width={200}
            height={200}
            className="absolute -right-4 bottom-2 object-cover"
          />
        </GameCard>
      </main>
    </>
  );
};

export default Index;
