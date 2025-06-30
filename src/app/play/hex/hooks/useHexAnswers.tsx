import { useLocalStorage } from "usehooks-ts";
import { HexAnswerData } from "../types";

export default function useHexAnswers(userId = "unauthenticated") {
  return useLocalStorage<Record<string, HexAnswerData>>(
    `saltong/hex/answers/${userId}`,
    {},
    {
      initializeWithValue: false,
    }
  );
}
