import { GameConfig, GameMode } from "./types";

export const SALTONG_CONFIGS = {
  main: {
    maxTries: 6,
    wordLen: 5,
    subtitle: "",
    colorScheme: "green",
    mode: "main",
    tableName: "saltong-main-rounds",
    icon: "/main.svg",
    startDate: "2022-01-14",
    blurb: "The classic Saltong game, guess the five-letter word",
  },
  mini: {
    maxTries: 5,
    wordLen: 4,
    subtitle: "Mini",
    colorScheme: "blue",
    mode: "mini",
    tableName: "saltong-mini-rounds",
    icon: "/mini.svg",
    startDate: "2022-01-16",
    blurb: "A shorter version of Saltong, try to guess the four-letter word",
  },
  max: {
    maxTries: 8,
    wordLen: 7,
    subtitle: "Max",
    colorScheme: "red",
    mode: "max",
    tableName: "saltong-max-rounds",
    icon: "/max.svg",
    startDate: "2022-01-16",
    blurb: "The longer version of Saltong, guess the seven-letter word",
  },
} satisfies Record<GameMode, GameConfig>;
