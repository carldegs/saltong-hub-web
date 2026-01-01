import { GameRegistry } from "../game-registry/types";
import { LetterStatus, SaltongAdditionalConfig, SaltongMode } from "./types";

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
      howToPlayExamples: [
        {
          word: "SAMPU",
          statuses: [
            LetterStatus.Incorrect,
            LetterStatus.Incorrect,
            LetterStatus.Incorrect,
            LetterStatus.Correct,
            LetterStatus.Incorrect,
          ],
          description: "The letter P is in the word and in the correct spot.",
        },
        {
          word: "LUPIT",
          statuses: [
            LetterStatus.Incorrect,
            LetterStatus.Partial,
            LetterStatus.Incorrect,
            LetterStatus.Incorrect,
            LetterStatus.Incorrect,
          ],
          description: "The letter U is in the word but in the wrong spot.",
        },
        {
          word: "PUNTA",
          statuses: [
            LetterStatus.Incorrect,
            LetterStatus.Incorrect,
            LetterStatus.Incorrect,
            LetterStatus.Incorrect,
            LetterStatus.Incorrect,
          ],
          description: "The letters are not in the word in any spot.",
        },
      ],
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
      howToPlayExamples: [
        {
          word: "SALI",
          statuses: [
            LetterStatus.Incorrect,
            LetterStatus.Correct,
            LetterStatus.Incorrect,
            LetterStatus.Incorrect,
          ],
          description: "The letter A is in the word and in the correct spot.",
        },
        {
          word: "GULO",
          statuses: [
            LetterStatus.Incorrect,
            LetterStatus.Partial,
            LetterStatus.Incorrect,
            LetterStatus.Incorrect,
          ],
          description: "The letter U is in the word but in the wrong spot.",
        },
        {
          word: "PUNO",
          statuses: [
            LetterStatus.Incorrect,
            LetterStatus.Incorrect,
            LetterStatus.Incorrect,
            LetterStatus.Incorrect,
          ],
          description: "The letters are not in the word in any spot.",
        },
      ],
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
      howToPlayExamples: [
        {
          word: "TANGLAW",
          statuses: [
            LetterStatus.Incorrect,
            LetterStatus.Incorrect,
            LetterStatus.Incorrect,
            LetterStatus.Correct,
            LetterStatus.Incorrect,
            LetterStatus.Incorrect,
            LetterStatus.Incorrect,
          ],
          description: "The letter G is in the word and in the correct spot.",
        },
        {
          word: "KOMENTO",
          statuses: [
            LetterStatus.Incorrect,
            LetterStatus.Partial,
            LetterStatus.Incorrect,
            LetterStatus.Incorrect,
            LetterStatus.Incorrect,
            LetterStatus.Incorrect,
            LetterStatus.Incorrect,
          ],
          description: "The letter O is in the word but in the wrong spot.",
        },
        {
          word: "PIYESTA",
          statuses: [
            LetterStatus.Incorrect,
            LetterStatus.Incorrect,
            LetterStatus.Incorrect,
            LetterStatus.Incorrect,
            LetterStatus.Incorrect,
            LetterStatus.Incorrect,
            LetterStatus.Incorrect,
          ],
          description: "The letters are not in the word in any spot.",
        },
      ],
    },
  },
} as const satisfies GameRegistry<SaltongAdditionalConfig, SaltongMode>;
