import { GameRegistry } from "../game-registry/types";
import { SaltongAdditionalConfig, SaltongMode } from "./types";

export const SALTONG_CONFIG = {
  id: "saltong",
  displayName: "Saltong",
  hasModes: true,
  modes: {
    classic: {
      mode: "classic",
      displayName: "Saltong Classic",
      path: "",
      icon: "/main.svg",
      blurb: "The classic Saltong game, guess the five-letter word",
      colorScheme: "green",
      maxTries: 6,
      wordLen: 5,
      startDate: "2022-01-14",
    },
    mini: {
      mode: "mini",
      displayName: "Saltong Mini",
      path: "/mini",
      icon: "/mini.svg",
      blurb: "A shorter version of Saltong, try to guess the four-letter word",
      colorScheme: "blue",
      maxTries: 5,
      wordLen: 4,
      startDate: "2022-01-16",
    },
    max: {
      mode: "max",
      displayName: "Saltong Max",
      path: "/max",
      icon: "/max.svg",
      blurb: "The longer version of Saltong, guess the seven-letter word",
      colorScheme: "red",
      maxTries: 8,
      wordLen: 7,
      startDate: "2022-01-16",
    },
  },
} as const satisfies GameRegistry<SaltongAdditionalConfig, SaltongMode>;
