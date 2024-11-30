import { useLocalStorage } from "usehooks-ts";
import { HexAnswerData } from "../types";

export default function useHexAnswers() {
  return useLocalStorage<Record<string, HexAnswerData>>(
    `saltong/hex/answers`,
    {},
    {
      initializeWithValue: false,
    }
  );
}
