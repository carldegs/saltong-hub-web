import { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useLocalStorage } from "usehooks-ts";
import { useSupabaseClient } from "@/lib/supabase/client";
import {
  HexVaultRound,
  HexVaultRoundsParams,
  HexStoredUserRound,
} from "../types";
import { getHexVaultRounds } from "../queries/getHexVaultRounds";

/**
 * Fetches hex user rounds in a date range for a given user.
 * Returns minimal fields used by the vault calendar.
 * Handles unauthenticated users via localStorage.
 */
export function useHexVaultRounds(params: HexVaultRoundsParams) {
  const { userId, startDate, endDate } = params;
  const [localPlayerRounds] = useLocalStorage<HexStoredUserRound[]>(
    "hex-vault-rounds",
    [],
    { initializeWithValue: false }
  );
  const supabase = useSupabaseClient();
  const queryClient = useQueryClient();

  // Keep cache in sync for unauthenticated users
  useEffect(() => {
    if (userId === "unauthenticated") {
      const filtered = localPlayerRounds.filter(
        (round) =>
          round.userId === userId &&
          round.date >= startDate &&
          round.date <= endDate
      );
      queryClient.setQueryData(
        ["hex-vault-rounds", { userId, startDate, endDate }],
        filtered
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [localPlayerRounds, userId, startDate, endDate]);

  return useQuery({
    queryKey: ["hex-vault-rounds", { userId, startDate, endDate }],
    queryFn: async () => {
      if (userId === "unauthenticated") {
        return localPlayerRounds
          .filter(
            (round) =>
              round.userId === userId &&
              round.date >= startDate &&
              round.date <= endDate
          )
          .map(
            ({
              date,
              liveScore,
              guessedWords,
              updatedAt,
              isRevealed,
              isTopRank,
            }) =>
              ({
                date,
                liveScore,
                guessedWords,
                updatedAt,
                isRevealed,
                isTopRank,
              }) satisfies HexVaultRound
          );
      }

      const { data, error } = await getHexVaultRounds(supabase, {
        userId,
        startDate,
        endDate,
      });
      if (error) throw error;
      return data;
    },
    select: (data) =>
      data.map((row) => ({
        date: row.date,
        liveScore: row.liveScore ?? 0,
        guessedWords: (() => {
          if (Array.isArray(row.guessedWords)) {
            return row.guessedWords;
          }
          if (typeof row.guessedWords === "string" && row.guessedWords) {
            return row.guessedWords.split(",");
          }
          return [];
        })(),
        updatedAt: row.updatedAt,
        isRevealed: row.isRevealed,
        isTopRank: row.isTopRank,
      })),
    enabled: !!userId && !!startDate && !!endDate,
  });
}
