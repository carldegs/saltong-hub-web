import { useLocalStorage } from "usehooks-ts";
import { GameMode, RoundAnswerData } from "../types";

export default function useRoundAnswers(mode: GameMode) {
  return useLocalStorage<Record<string, RoundAnswerData>>(
    `saltong/${mode}/answers`,
    {},
    {
      initializeWithValue: false,
    }
  );
}
