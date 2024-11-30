import { useCallback, useMemo } from "react";
import { GameMode, RoundAnswerData } from "../types";
import useRoundAnswers from "./useRoundAnswers";

export default function useRoundAnswer(mode: GameMode, gameDate: string) {
  const [rounds, setRounds] = useRoundAnswers(mode);

  const round = useMemo(
    () =>
      rounds[gameDate] || {
        grid: "",
      },
    [rounds, gameDate]
  );

  const setRound = useCallback(
    (
      data:
        | Omit<RoundAnswerData, "updatedAt">
        | ((prev: RoundAnswerData) => Omit<RoundAnswerData, "updatedAt">)
    ) => {
      setRounds((prev) => {
        const newData =
          typeof data === "function"
            ? data(
                prev?.[gameDate] || {
                  grid: "",
                }
              )
            : data;
        return {
          ...prev,
          [gameDate]: {
            ...newData,
            updatedAt: Date.now(),
          },
        };
      });
    },
    [setRounds, gameDate]
  );

  const reset = useCallback(() => {
    setRounds((prev) => {
      delete prev[gameDate];
      return prev;
    });
  }, [setRounds, gameDate]);

  return useMemo(
    () => [round, setRound, reset] as const,
    [round, setRound, reset]
  );
}
