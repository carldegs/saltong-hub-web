import { useCallback, useEffect, useMemo, useState } from "react";
import useHexAnswers from "./useHexAnswers";
import { HexAnswerData } from "../types";

export default function useHexAnswer(gameDate: string) {
  const [rounds, setRounds] = useHexAnswers();
  const [isInit, setIsInit] = useState(false);

  useEffect(() => {
    if (!isInit) {
      setIsInit(true);
    }
  }, [isInit]);

  const round = useMemo(
    () =>
      rounds[gameDate] ||
      ({
        guessedWords: [],
        liveScore: 0,
      } satisfies HexAnswerData),
    [rounds, gameDate]
  );

  const setRound = useCallback(
    (
      data:
        | Omit<HexAnswerData, "updatedAt">
        | ((prev: HexAnswerData) => Omit<HexAnswerData, "updatedAt">)
    ) => {
      setRounds((prev) => {
        const newData =
          typeof data === "function"
            ? data(
                prev?.[gameDate] || {
                  guessedWords: [],
                  liveScore: 0,
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
    [gameDate, setRounds]
  );

  const reset = useCallback(() => {
    setRounds((prev) => {
      delete prev[gameDate];
      return prev;
    });
  }, [setRounds, gameDate]);

  return useMemo(
    () => [round, setRound, { reset, isInit }] as const,
    [round, setRound, reset, isInit]
  );
}
