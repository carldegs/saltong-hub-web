import { SaltongUserStats, SaltongMode, SaltongUserRound } from "../types";
import { SALTONG_CONFIG } from "../config";

export function computeSaltongUserStats({
  prev,
  data,
  mode,
}: {
  prev?: SaltongUserStats;
  data: Pick<
    SaltongUserRound,
    "isCorrect" | "solvedTurn" | "solvedLive" | "date"
  > & { roundId?: number };
  mode: SaltongMode;
}): Omit<SaltongUserStats, "userId" | "mode"> {
  const maxTries = SALTONG_CONFIG.modes[mode].maxTries;

  let curr: Omit<SaltongUserStats, "userId" | "mode"> = prev || {
    totalWins: 0,
    totalLosses: 0,
    currentWinStreak: 0,
    longestWinStreak: 0,
    winTurns: new Array(maxTries).fill(0),
    lastGameDate: null,
    lastRoundId: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  if (data.isCorrect) {
    curr = {
      ...curr,
      totalWins: (curr.totalWins ?? 0) + 1,
      winTurns: (curr.winTurns ?? new Array(maxTries).fill(0)).map(
        (turns, idx) =>
          idx === (data.solvedTurn as number) - 1
            ? ((turns as number) ?? 0) + 1
            : turns
      ),
    };

    if (data.solvedLive && data.roundId) {
      const resetStreak = (curr.lastRoundId ?? 0) !== data.roundId - 1;
      const currentWinStreak = resetStreak
        ? 1
        : (curr.currentWinStreak ?? 0) + 1;

      curr = {
        ...curr,
        currentWinStreak,
        longestWinStreak: Math.max(
          curr.longestWinStreak ?? 0,
          currentWinStreak
        ),
      };
    }
  } else {
    curr = {
      ...curr,
      totalLosses: (curr.totalLosses ?? 0) + 1,
      currentWinStreak: 0,
    };
  }

  if (data.solvedLive && data.roundId) {
    curr = {
      ...curr,
      lastGameDate: data.date,
      lastRoundId: data.roundId,
    };
  }

  curr = {
    ...curr,
    updatedAt: new Date().toISOString(),
  };

  return curr;
}
