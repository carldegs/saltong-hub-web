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

  const timeSolvedInSec = useMemo(() => {
    if (round.startedAt && round.endedAt) {
      const started = new Date(round.startedAt).getTime();
      const ended = new Date(round.endedAt).getTime();
      return Math.floor((ended - started) / 1000);
    }
    return undefined;
  }, [round.startedAt, round.endedAt]);

  return useMemo(
    () =>
      ({
        isCorrect: !!round.isCorrect,
        status,
        round,
        timeSolvedInSec,
      }) satisfies RoundStats,
    [round, status, timeSolvedInSec]
  );
}
