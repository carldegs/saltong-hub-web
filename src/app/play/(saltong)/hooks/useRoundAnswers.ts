import { useLocalStorage } from "usehooks-ts";
import { RoundAnswerData } from "../types";

export default function useRoundAnswers(gameId: string) {
  return useLocalStorage<Record<string, RoundAnswerData>>(
    `saltong/${gameId}/answers`,
    {},
    {
      initializeWithValue: false,
    }
  );
}
