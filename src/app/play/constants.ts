import { GameId, GameSettings } from "./types";

export const DICTIONARY_KEY = "saltong-dict-v1";

export const GAME_SETTINGS = {
  "saltong-main": {
    id: "saltong-main",
    name: "Saltong",
    type: "saltong",
    mode: "main",
    path: "",
    icon: "/main.svg",
    blurb: "The classic Saltong game, guess the five-letter word",
    colorScheme: "green",
    config: {
      maxTries: 6,
      wordLen: 5,
      tableName: "saltong-main-rounds",
      startDate: "2022-01-14",
    },
  },
  "saltong-mini": {
    id: "saltong-mini",
    name: "Saltong Mini",
    type: "saltong",
    mode: "mini",
    path: "/mini",
    icon: "/mini.svg",
    blurb: "A shorter version of Saltong, try to guess the four-letter word",
    colorScheme: "blue",
    config: {
      maxTries: 5,
      wordLen: 4,
      tableName: "saltong-mini-rounds",
      startDate: "2022-01-16",
    },
  },
  "saltong-max": {
    id: "saltong-max",
    name: "Saltong Max",
    type: "saltong",
    mode: "max",
    path: "/max",
    icon: "/max.svg",
    blurb: "The longer version of Saltong, guess the seven-letter word",
    colorScheme: "red",
    config: {
      maxTries: 8,
      wordLen: 7,
      tableName: "saltong-max-rounds",
      startDate: "2022-01-16",
    },
  },
  hex: {
    id: "hex",
    name: "Hex",
    type: "hex",
    path: "/hex",
    icon: "/hex.svg",
    blurb:
      "Form words using the given letters, but don’t forget—the center letter is key!",
    colorScheme: "purple",
    config: {
      startDate: "2022-01-21",
      ranks: [
        { name: "bagito", percentage: 0, icon: "👶" },
        { name: "sakto", percentage: 0.02, icon: "🌱" },
        { name: "umuusad", percentage: 0.05, icon: "🚴" },
        { name: "marunong", percentage: 0.07, icon: "🎯" },
        { name: "magaling", percentage: 0.15, icon: "💪" },
        { name: "mahusay", percentage: 0.25, icon: "🌟" },
        { name: "matinik", percentage: 0.35, icon: "🦈" },
        { name: "bihasa", percentage: 0.5, icon: "🎓" },
        { name: "alamat", percentage: 0.7, icon: "👑" },
        { name: "bathala", percentage: 0.9, icon: "⚡" },
      ],
      tableName: "saltong-hex-rounds",
    },
  },
} as const satisfies Record<GameId, GameSettings>;
