import { useMemo } from "react";
import useRoundAnswers from "./useRoundAnswers";
import { GameMode, RoundStats } from "../types";

export default function useRoundStats(mode: GameMode, gameDate: string) {
  const [rounds] = useRoundAnswers(mode);

  const round = useMemo(
    () =>
      rounds[gameDate] || {
        grid: "",
      },
    [rounds, gameDate]
  );

  const status = useMemo(() => {
    if (!round.startedAt) {
      return "idle";
    }

    if (round.startedAt && !round.endedAt) {
      return "partial";
    }

    if (round.isCorrect) {
      return "correct";
    }

    return "incorrect";
  }, [round.endedAt, round.isCorrect, round.startedAt]);

  return useMemo(
    () =>
      ({
        isCorrect: !!round.isCorrect,
        status,
      }) satisfies RoundStats,
    [round.isCorrect, status]
  );
}
