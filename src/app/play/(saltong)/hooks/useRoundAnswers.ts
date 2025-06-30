import { useLocalStorage } from "usehooks-ts";
import { RoundAnswerData } from "../types";
import { GameId } from "../../types";

export default function useRoundAnswers(gameId: GameId) {
  return useLocalStorage<Record<string, RoundAnswerData>>(
    `saltong/${gameId}/answers`,
    {},
    {
      initializeWithValue: false,
    }
  );
}
