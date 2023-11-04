import { Volume2 } from "lucide-react";
import Head from "next/head";
import { useTetrisContext } from "~/components/tetris/context";
import Game from "~/components/tetris/game";
import { Button } from "~/components/ui/button";
import { controls, highScoresLimit } from "~/utils/tetris/constants";
import { cn, getMonth } from "~/utils/helpers";
import { api } from "~/utils/api";
import Loading from "~/components/loading";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import NoContent from "~/components/noContent";

const Tetris = () => {
  const { data: session, status: sessionStatus } = useSession();
  const { data: scores, isLoading: fetchingScores } =
    api.tetris.getHighScores.useQuery(
      { take: highScoresLimit },
      {
        onError: () =>
          toast.error(
            "Failed to fetch high scores. Please refresh the page and try again.",
          ),
      },
    );
  const { data: userScores, isLoading: fetchingUserScores } =
    api.tetris.getUserHighScores.useQuery(undefined, {
      enabled: sessionStatus === "authenticated",
      onError: () =>
        toast.error(
          "Failed to fetch your high scores. Please refresh the page and try again.",
        ),
    });
  const {
    gameStarted,
    gameOver,
    setIsPlaying,
    isPlaying,
    level,
    alert,
    onFire,
    message,
    startGame,
    replay,
  } = useTetrisContext();

  return (
    <>
      <Head>
        <title>Tetris</title>
      </Head>
      <main className="flex w-full flex-col gap-2 lg:flex-row">
        <Game />
        <div className="flex flex-1 flex-col-reverse gap-2 pb-2 lg:grid lg:grid-cols-6 lg:grid-rows-6 lg:pb-0">
          <div className="flex flex-col border p-2 text-sm lg:col-span-4 lg:row-span-4">
            <h1 className="section-label mb-8 lg:mb-8">Summary</h1>
            <h1 className="h1">Tetris</h1>
            <p className="mb-4">
              Tetris is a classic video game that was created by Russian game
              designer Alexey Pajitnov in 1984. The game&apos;s name is derived
              from the Greek word &ldquo;tetra,&rdquo; which means four, and the
              game is all about fitting different-shaped blocks, known as
              Tetriminos, into a rectangular playing field.
            </p>
            <p className="mb-4">
              The objective of Tetris is simple: to complete horizontal lines of
              blocks without any gaps. When a line is completed, it disappears,
              and the player earns points. As the game progresses, the speed at
              which the Tetriminos fall increases, making it more challenging to
              fit them together and clear lines.
            </p>
            <p className="mb-4">
              Tetris has become one of the most iconic and enduring video games
              of all time, known for its addictive gameplay and catchy music.
              It&apos;s available on a wide range of platforms, from classic
              arcade machines to modern smartphones and gaming consoles. The
              game&apos;s simple yet compelling mechanics have made it a beloved
              and timeless classic in the world of gaming.
            </p>
            <p>
              This is my attempt at recreating the original version of the game.
              At the moment there may still be some bugs so apologies in advance
              if you run into any of those. Enjoy and see if you can beat my
              high score.
            </p>
          </div>
          <div className="flex flex-col gap-8 border p-2 text-sm lg:col-span-2 lg:row-span-5">
            <h1 className="section-label flex-none">High Scores</h1>
            {fetchingScores ? (
              <Loading />
            ) : (
              <>
                {!!session && (
                  <div className="grid flex-1 grid-cols-2">
                    <h1 className="text-destructive">
                      {session.user.username}
                    </h1>
                    {fetchingUserScores ? (
                      <Loading />
                    ) : (
                      <>
                        {userScores && userScores.scores.length > 0 ? (
                          <ul>
                            <li>
                              <p className="text-base font-medium">
                                {userScores.highScore}
                              </p>
                            </li>
                            {userScores.scores
                              .slice()
                              .reverse()
                              .slice(0, 9)
                              .map((score, index) => (
                                <li key={index}>
                                  <p>{score}</p>
                                </li>
                              ))}
                          </ul>
                        ) : (
                          <NoContent>
                            You haven&apos;t played any games yet.
                          </NoContent>
                        )}
                      </>
                    )}
                  </div>
                )}
                <div className="grid flex-1 grid-cols-2">
                  <h1 className="text-destructive">{getMonth()}</h1>
                  {scores && scores.monthly.length > 0 ? (
                    <ul>
                      {scores.monthly.map((score, index) => (
                        <li key={index} className="flex gap-2">
                          <p>{score.user.username}</p>
                          <p className="text-base font-medium">
                            {score.highScore}
                          </p>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <NoContent>No games have been played this month.</NoContent>
                  )}
                </div>
                <div className="grid flex-1 grid-cols-2">
                  <h1 className="text-destructive">All Time</h1>
                  {scores && scores.allTime.length > 0 ? (
                    <ul>
                      {scores.allTime.map((score, index) => (
                        <li key={index} className="flex gap-2">
                          <p>{score.user.username}</p>
                          <p className="text-base font-medium">
                            {score.highScore}
                          </p>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <NoContent>
                      No games have been played. Does this game suck?!
                    </NoContent>
                  )}
                </div>
              </>
            )}
          </div>
          <div className="col-span-4 flex flex-col border p-2 text-sm">
            <h1 className="section-label mb-8 lg:mb-0">Controls</h1>
            <div className="flex items-end justify-between gap-2">
              <div className="hidden gap-2 lg:flex">
                <Button
                  onClick={() => {
                    if (!gameStarted) {
                      startGame();
                    } else if (gameOver) {
                      replay();
                    } else {
                      setIsPlaying(!isPlaying);
                    }
                  }}
                  variant="outline"
                >
                  {!gameStarted
                    ? "New Game"
                    : gameOver
                    ? "Replay"
                    : isPlaying
                    ? "Pause"
                    : "Resume"}
                </Button>
                <Button disabled variant="outline" size="icon">
                  <Volume2 strokeWidth={1} />
                </Button>
              </div>
              <ul className="grid grid-cols-2 gap-2 text-xs">
                {controls.map((control, index) => (
                  <li key={index} className="grid grid-cols-2 items-end gap-2">
                    <p className="border bg-accent px-2 py-1 text-center font-medium">
                      {control.key}
                    </p>
                    <p>{control.action}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="col-span-6 flex gap-2">
            <div className="flex gap-2 lg:hidden">
              <Button
                className="h-full"
                onClick={() => {
                  if (!gameStarted) {
                    startGame();
                  } else if (gameOver) {
                    replay();
                  } else {
                    setIsPlaying(!isPlaying);
                  }
                }}
                variant="outline"
              >
                {!gameStarted
                  ? "New Game"
                  : gameOver
                  ? "Replay"
                  : isPlaying
                  ? "Pause"
                  : "Resume"}
              </Button>
              <Button className="h-full" disabled variant="outline" size="icon">
                <Volume2 strokeWidth={1} />
              </Button>
            </div>
            <div className="overflow-hidden border p-2">
              <h1 className="marquee text-2xl font-bold uppercase lg:text-9xl">
                {Array.from({ length: 4 }).map((_, index) => (
                  <span
                    className={cn(
                      alert && !onFire && "animate-blink",
                      onFire && "animate-on-fire",
                    )}
                    key={index}
                  >
                    &nbsp;
                    {gameStarted ? (
                      message ?? (
                        <>
                          Level
                          <span className="text-destructive">{level}</span>
                        </>
                      )
                    ) : (
                      <>Wanna Play?</>
                    )}
                  </span>
                ))}
              </h1>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default Tetris;
