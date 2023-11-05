import { type GameName, type Game } from "./types";

export const fakePassword = "nice try ;)";

export const library: Record<GameName, Game> = {
  tetris: {
    id: 1,
    name: "Tetris",
    engine: "Javascript",
    date: "2023",
    description: " A faithful recreation of the 1984 Soviet classic.",
    status: "Live",
    href: "/tetris",
  },
  pokemon: {
    id: 2,
    name: "Pokemon",
    engine: "WebGL",
    date: "Coming Soon",
    description:
      "A personal clone/homage incorporating the timeless game loop.",
    status: "Under Development",
    href: "/pokemon",
  },
};
