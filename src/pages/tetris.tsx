import { VolumeX } from "lucide-react";
import Head from "next/head";
import { useTetrisContext } from "~/components/tetris/context";
import Game from "~/components/tetris/game";
import { Button } from "~/components/ui/button";
import { controls } from "~/utils/tetris/constants";
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
      { take: 10 },
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
    message,
    startGame,
    replay,
  } = useTetrisContext();

  return (
    <>
      <Head>
        <title>Tetris</title>
      </Head>
      <main className="flex w-full gap-2 p-2">
        <Game />
        <div className="grid flex-1 grid-cols-6 grid-rows-6 gap-2">
          <div className="col-span-4 row-span-4 flex flex-col border p-2 text-sm">
            <h1 className="section-label">Summary</h1>
            <h1 className="h1">Tetris</h1>
            <p>
              Tetris is a classic video game that was created by Russian game
              designer Alexey Pajitnov in 1984. The game&apos;s name is derived
              from the Greek word &ldquo;tetra,&rdquo; which means four, and the
              game is all about fitting different-shaped blocks, known as
              Tetriminos, into a rectangular playing field. The objective of
              Tetris is simple: to complete horizontal lines of blocks without
              any gaps. When a line is completed, it disappears, and the player
              earns points. As the game progresses, the speed at which the
              Tetriminos fall increases, making it more challenging to fit them
              together and clear lines. Tetris has become one of the most iconic
              and enduring video games of all time, known for its addictive
              gameplay and catchy music. It&apos;s available on a wide range of
              platforms, from classic arcade machines to modern smartphones and
              gaming consoles. The game&apos;s simple yet compelling mechanics
              have made it a beloved and timeless classic in the world of
              gaming.
            </p>
          </div>
          <div className="col-span-2 row-span-5 flex flex-col gap-8 border p-2 text-sm">
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
            <h1 className="section-label">Controls</h1>
            <div className="flex items-end justify-between gap-2">
              <div className="flex gap-2">
                <Button
                  onClick={() => {
                    if (!gameStarted) {
                      startGame();
                      return;
                    }
                    if (gameOver) {
                      replay();
                      return;
                    }
                    setIsPlaying(!isPlaying);
                  }}
                  variant="outline"
                >
                  {!gameStarted
                    ? "New Game"
                    : gameOver
                    ? "Replay"
                    : isPlaying
                    ? "Pause"
                    : "Play"}
                </Button>
                <Button variant="outline" size="icon">
                  <VolumeX strokeWidth={1} />
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
          <div className="col-span-6 overflow-hidden border p-2">
            <h1 className="marquee text-9xl font-bold uppercase">
              {Array.from({ length: 4 }).map((_, index) => (
                <span className={cn(alert && "animate-blink")} key={index}>
                  &nbsp;
                  {gameStarted ? (
                    message ?? (
                      <>
                        Level <span className="text-destructive">{level}</span>
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
      </main>
    </>
  );
};

export default Tetris;
