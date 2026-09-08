import { HOW_TO_PLAY_INTROS } from "@/features/game-registry/how-to-play-copy";
import { SALTONG_CONFIG } from "./config";
import type { SaltongMode } from "./types";

const INTRO_BY_MODE = {
  classic: HOW_TO_PLAY_INTROS.saltongClassic,
  mini: HOW_TO_PLAY_INTROS.saltongMini,
  max: HOW_TO_PLAY_INTROS.saltongMax,
} as const;

export function getSaltongHowToPlayContent(mode: SaltongMode) {
  const { displayName, wordLen, howToPlayExamples } =
    SALTONG_CONFIG.modes[mode];

  return {
    displayName,
    intro: INTRO_BY_MODE[mode],
    wordLen,
    examples: howToPlayExamples,
  };
}
