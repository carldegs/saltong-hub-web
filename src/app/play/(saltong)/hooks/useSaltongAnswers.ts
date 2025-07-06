import { useLocalStorage } from "usehooks-ts";
import { useCallback, useMemo } from "react";
import { RoundAnswerData } from "../types";
import { GameId } from "../../types";

interface SaltongAnswerFilters {
  userId?: string;
  gameId: GameId;
  gameDate: string;
}

const DEFAULT_USER_ID = "unauthenticated";

export const useSaltongAnswersStorage = () => {
  return useLocalStorage<Record<string, RoundAnswerData>>(
    `saltong/answers`,
    {},
    {
      initializeWithValue: false,
    }
  );
};

/**
 * Saltong Answers Hook
 *
 * Provides localStorage-backed answer management for Saltong games.
 *
 * @returns [answers, actions]
 */
const useSaltongAnswers = () => {
  const [answers, setAnswersRaw] = useSaltongAnswersStorage();

  const getKey = useCallback(
    ({ userId = DEFAULT_USER_ID, gameId, gameDate }: SaltongAnswerFilters) =>
      `${gameId}#${userId}#${gameDate}`,
    []
  );

  const getAnswer = useCallback(
    (filters: SaltongAnswerFilters): RoundAnswerData | undefined => {
      const key = getKey(filters);
      return answers[key];
    },
    [answers, getKey]
  );

  const getUserAnswersByGameId = useCallback(
    ({
      gameId,
      userId = DEFAULT_USER_ID,
    }: Omit<SaltongAnswerFilters, "gameDate">): RoundAnswerData[] =>
      Object.values(answers).filter(
        (answer) =>
          answer.gameId === gameId && (userId ? answer.userId === userId : true)
      ),
    [answers]
  );

  const setAnswer = useCallback(
    (data: RoundAnswerData) => {
      const key = getKey({
        userId: data.userId || DEFAULT_USER_ID,
        gameId: data.gameId,
        gameDate: data.gameDate,
      });
      setAnswersRaw((prev) => {
        const prevAnswer = prev[key];
        // Only update if changed
        if (JSON.stringify(prevAnswer) === JSON.stringify(data)) return prev;
        return {
          ...prev,
          [key]: {
            ...data,
            updatedAt: Date.now(),
          },
        };
      });
    },
    [getKey, setAnswersRaw]
  );

  // Clear all or by filter
  const clearAnswers = useCallback(
    (filters?: Partial<SaltongAnswerFilters>) => {
      if (!filters) {
        setAnswersRaw({});
        return;
      }
      setAnswersRaw((prev) => {
        const entries = Object.entries(prev);
        const filtered = entries.filter(([, answer]) => {
          if (filters.userId && answer.userId !== filters.userId) return true;
          if (filters.gameId && answer.gameId !== filters.gameId) return true;
          if (filters.gameDate && answer.gameDate !== filters.gameDate)
            return true;
          return false;
        });
        return Object.fromEntries(filtered);
      });
    },
    [setAnswersRaw]
  );

  // Clear all answers for a user for a specific gameId
  const clearUserAnswersByGameId = useCallback(
    (userId: string, gameId: string) => {
      setAnswersRaw((prev) => {
        const entries = Object.entries(prev);
        const filtered = entries.filter(([, answer]) => {
          return !(answer.userId === userId && answer.gameId === gameId);
        });
        return Object.fromEntries(filtered);
      });
    },
    [setAnswersRaw]
  );

  // Clear all answers for a specific user (regardless of gameId/date)
  const clearUserAnswers = useCallback(
    (userId: string) => {
      setAnswersRaw((prev) => {
        const entries = Object.entries(prev);
        const filtered = entries.filter(
          ([, answer]) => answer.userId !== userId
        );
        return Object.fromEntries(filtered);
      });
    },
    [setAnswersRaw]
  );

  // Memoize answers for consumers
  const memoizedAnswers = useMemo(() => answers, [answers]);

  return [
    memoizedAnswers,
    {
      setAnswer,
      getAnswer,
      getUserAnswersByGameId,
      clearAnswers,
      clearUserAnswersByGameId,
      clearUserAnswers,
      getKey,
    },
  ] as const;
};

export const useSaltongAnswer = (data: SaltongAnswerFilters) => {
  const [, actions] = useSaltongAnswers();

  const answer = useMemo(
    () =>
      actions.getAnswer(data) ??
      ({
        grid: "",
      } as RoundAnswerData),
    [actions, data]
  );

  const setAnswer = useCallback(
    (
      newData: Omit<
        RoundAnswerData,
        "updatedAt" | "userId" | "gameId" | "gameDate"
      >
    ) => {
      actions.setAnswer({
        ...newData,
        userId: data.userId || DEFAULT_USER_ID,
        gameId: data.gameId,
        gameDate: data.gameDate,
        updatedAt: Date.now(),
      });
    },
    [actions, data]
  );

  return [answer, setAnswer] as const;
};

export default useSaltongAnswers;
