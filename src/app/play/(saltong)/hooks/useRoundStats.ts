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

  return useMemo(
    () =>
      ({
        isCorrect: !!round.isCorrect,
        time:
          round.endedAt && round.startedAt
            ? round.endedAt - round.startedAt
            : -1,
      }) satisfies RoundStats,
    [round.endedAt, round.isCorrect, round.startedAt]
  );
}
