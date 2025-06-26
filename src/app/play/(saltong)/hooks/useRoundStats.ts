import { useMemo } from "react";
import useRoundAnswers from "./useRoundAnswers";
import { RoundStats } from "../types";
import { GameId } from "../../types";

export default function useRoundStats(gameId: GameId, roundDate: string) {
  const [rounds] = useRoundAnswers(gameId);

  const round = useMemo(
    () =>
      rounds[roundDate] || {
        grid: "",
      },
    [rounds, roundDate]
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
