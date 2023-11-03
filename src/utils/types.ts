export enum GameName {
  tetris = "tetris",
  pokemon = "pokemon",
}

export interface Game {
  id: number;
  name: string;
  engine: string;
  date: string;
  description: string;
  status: string;
  href: string;
}
