import { useCallback, useMemo } from "react";
import { RoundAnswerData, PlayerStats } from "../types";
import useRoundAnswers from "./useRoundAnswers";
import usePlayerStats from "./usePlayerStats";
import { GameId, SaltongGameSettings } from "../../types";
import { GAME_SETTINGS } from "../../constants";

export default function useRoundAnswer(
  gameId: GameId,
  gameDate: string,
  roundId?: number
) {
  const [rounds, setRounds] = useRoundAnswers(gameId);
  const [, setStats] = usePlayerStats();

  const updateStats = useCallback(
    (data: Omit<RoundAnswerData, "updatedAt">) => {
      setStats((prev) => {
        let curr =
          prev[gameId] ||
          ({
            gameId,
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

          if (data.solvedLive && roundId) {
            const resetStreak = curr.lastGameId !== roundId - 1;
            const currentWinStreak = resetStreak
              ? 1
              : curr.currentWinStreak + 1;

            curr = {
              ...curr,
              currentWinStreak,
              longestWinStreak: Math.max(
                curr.longestWinStreak,
                currentWinStreak
              ),
            };
          }
        } else {
          curr = {
            ...curr,
            totalLosses: curr.totalLosses + 1,
            currentWinStreak: 0,
          };
        }

        if (data.solvedLive && roundId) {
          curr = {
            ...curr,
            lastGameDate: gameDate,
            lastGameId: roundId,
          };
        }

        curr = {
          ...curr,
          updatedAt: Date.now(),
        };

        return {
          ...prev,
          [gameId]: curr,
        };
      });
    },
    [gameDate, roundId, gameId, setStats]
  );

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

        if (newData.endedAt) {
          updateStats(newData);
        }

        return {
          ...prev,
          [gameDate]: {
            ...newData,
            updatedAt: Date.now(),
          },
        };
      });
    },
    [setRounds, gameDate, updateStats]
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
