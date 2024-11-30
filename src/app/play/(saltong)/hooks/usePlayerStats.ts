import { GameMode, PlayerStats, RoundAnswerData } from "../types";
import { useMemo } from "react";
import { getDateInPh, getPrevDateInPh } from "@/utils/time";
import { add } from "date-fns";
import useRoundAnswers from "./useRoundAnswers";

// deprecate. save stats in db instead
/** @deprecated Refactor to save stats in db
 */
export default function usePlayerStats(mode: GameMode): PlayerStats {
  const [rounds] = useRoundAnswers(mode);

  const currentRound = useMemo(() => getDateInPh(), []);
  const prevRound = useMemo(() => getPrevDateInPh(), []);

  const isCurrentRoundDone = useMemo(() => {
    return !!rounds[currentRound]?.endedAt;
  }, [rounds, currentRound]);

  const { numWins, numWinsLive, numLosses } = useMemo(() => {
    return Object.values(rounds).reduce(
      (acc, round) => {
        if (round.isCorrect) {
          acc.numWins++;
          if (round.solvedLive) {
            acc.numWinsLive++;
          }
        } else {
          acc.numLosses++;
        }
        return acc;
      },
      {
        numWinsLive: 0,
        numWins: 0,
        numLosses: 0,
      }
    );
  }, [rounds]);

  const winRate = useMemo(() => {
    if (numWins + numLosses === 0) {
      return -1;
    }

    return numWins / (numWins + numLosses);
  }, [numWins, numLosses]);

  const { winStreak, longestWinStreak } = useMemo(() => {
    let streaks: string[][] = [];

    let streakIdx = 0;

    Object.entries(rounds)
      .sort(([a], [b]) => b.localeCompare(a))
      .filter(([, round]) => round.isCorrect && round.solvedLive)
      .forEach(([date]) => {
        if (!streaks[streakIdx]) {
          streaks[streakIdx] = [date];
        } else {
          const lastStreakDate = new Date(
            streaks[streakIdx][streaks[streakIdx].length - 1]
          ).getTime();
          const isPrevDate =
            new Date(date).getTime() ===
            add(lastStreakDate, { days: -1 }).getTime();

          if (isPrevDate) {
            streaks[streakIdx].push(date);
          } else {
            streakIdx++;
            streaks[streakIdx] = [date];
          }
        }
      });

    const currentStreak = streaks.find((streak) =>
      streak.includes(isCurrentRoundDone ? currentRound : prevRound)
    );

    const winStreak = currentStreak?.length || 0;
    const longestWinStreak = Math.max(
      0,
      ...streaks.map((streak) => streak.length)
    );

    return {
      winStreak,
      longestWinStreak,
    };
  }, [currentRound, isCurrentRoundDone, prevRound, rounds]);

  return useMemo(
    () =>
      ({
        numWins,
        numWinsLive,
        numLosses,
        winRate,
        winStreak,
        longestWinStreak,
      }) satisfies PlayerStats,
    [numWins, numWinsLive, numLosses, winRate, winStreak, longestWinStreak]
  );
}
