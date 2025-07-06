import { useLocalStorage } from "usehooks-ts";
import { PlayerStats, RoundAnswerData } from "../types";
import { GameId, SaltongGameSettings } from "../../types";
import { useCallback, useMemo } from "react";
import { GAME_SETTINGS } from "../../constants";

interface SaltongStatsFilters {
  userId: string;
  gameId: GameId;
  gameDate: string;
}

export default function useSaltongStats() {
  const [stats, setStats] = useLocalStorage<
    Partial<Record<string, PlayerStats>>
  >(
    `saltong/stats`,
    {},
    {
      initializeWithValue: false,
    }
  );

  const getKey = useCallback(
    ({ userId, gameId }: Omit<SaltongStatsFilters, "gameDate">) =>
      `${gameId}#${userId}`,
    []
  );

  const setStat = useCallback(
    (data: PlayerStats) => {
      const key = getKey({
        userId: data.userId || "unauthenticated",
        gameId: data.gameId,
      });
      setStats((prev) => ({
        ...prev,
        [key]: {
          ...data,
          updatedAt: Date.now(),
        },
      }));
    },
    [getKey, setStats]
  );

  const getStat = useCallback(
    (filters: SaltongStatsFilters) => {
      const key = getKey(filters);
      return stats[key];
    },
    [getKey, stats]
  );

  const clearUserStats = useCallback(
    (userId: string) => {
      setStats((prev) => {
        const entries = Object.entries(prev);
        const filtered = entries.filter(([, stat]) => stat?.userId !== userId);
        return Object.fromEntries(filtered);
      });
    },
    [setStats]
  );

  const memoizedStats = useMemo(() => stats, [stats]);

  return [
    memoizedStats,
    {
      getKey,
      setStats,
      setStat,
      getStat,
      clearUserStats,
    },
  ] as const;
}

export const useSaltongStat = (data: SaltongStatsFilters) => {
  const { userId, gameId, gameDate } = data;
  const [, actions] = useSaltongStats();

  const stat = useMemo(() => {
    return actions.getStat(data);
  }, [actions, data]);

  const setStat = useCallback(
    (
      data: Pick<RoundAnswerData, "isCorrect" | "solvedTurn" | "solvedLive"> & {
        roundId: number;
      }
    ) => {
      let curr =
        stat ||
        ({
          userId: userId ?? "unauthenticated",
          gameId: gameId,
          totalWins: 0,
          totalLosses: 0,
          currentWinStreak: 0,
          longestWinStreak: 0,
          winTurns: new Array(
            (GAME_SETTINGS[gameId] as SaltongGameSettings).config.maxTries
          ).fill(0),
          lastGameDate: "",
          lastGameId: 0,
          createdAt: Date.now(),
          updatedAt: 0,
        } satisfies PlayerStats);

      if (data.isCorrect) {
        curr = {
          ...curr,
          totalWins: curr.totalWins + 1,
          winTurns: curr.winTurns.map((turns, idx) =>
            idx === (data.solvedTurn as number) - 1 ? turns + 1 : turns
          ),
        };

        if (data.solvedLive && data.roundId) {
          const resetStreak = curr.lastGameId !== data.roundId - 1;
          const currentWinStreak = resetStreak ? 1 : curr.currentWinStreak + 1;

          curr = {
            ...curr,
            currentWinStreak,
            longestWinStreak: Math.max(curr.longestWinStreak, currentWinStreak),
          };
        }
      } else {
        curr = {
          ...curr,
          totalLosses: curr.totalLosses + 1,
          currentWinStreak: 0,
        };
      }

      if (data.solvedLive && data.roundId) {
        curr = {
          ...curr,
          lastGameDate: gameDate,
          lastGameId: data.roundId,
        };
      }

      curr = {
        ...curr,
        updatedAt: Date.now(),
      } satisfies PlayerStats;

      actions.setStat(curr);
    },
    [actions, gameDate, gameId, stat, userId]
  );

  return [stat, setStat] as const;
};
