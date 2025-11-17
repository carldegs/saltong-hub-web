import { GameRegistry } from "../game-registry/types";
import { HexAdditionalConfig } from "./types";

export const HEX_CONFIG = {
  id: "hex",
  displayName: "Saltong Hex",
  hasModes: false,
  path: "/hex",
  icon: "/hex.svg",
  blurb:
    "Form words using the given letters, but don’t forget—the center letter is key!",
  colorScheme: "purple",
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
  numWordsLimit: 150,
  minPangramLetters: 6,
  maxPangramLetters: 7,
  minWordListLetters: 4,
  maxWordListLetters: 19,
} as const satisfies GameRegistry<HexAdditionalConfig>;
