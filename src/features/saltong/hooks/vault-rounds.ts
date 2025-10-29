import { useEffect } from "react";
import { useLocalStorage } from "usehooks-ts";
import { useSupabaseClient } from "@/lib/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  SaltongUserRound,
  SaltongVaultRound,
  SaltongVaultRoundsParams,
} from "../types";
import { getSaltongVaultRounds } from "../queries/getSaltongVaultRounds";

/**
 * Fetches user rounds in a date range for a given user and mode.
 * Returns only { date, isCorrect, endedAt } for each round.
 * Handles unauthenticated users via localStorage.
 */
export function useSaltongVaultRounds(params: SaltongVaultRoundsParams) {
  const { userId, mode, startDate, endDate } = params;
  const [localPlayerRounds] = useLocalStorage<SaltongUserRound[]>(
    "saltong-vault-rounds",
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
          round.mode === mode &&
          round.userId === userId &&
          round.date >= startDate &&
          round.date <= endDate
      );
      queryClient.setQueryData(
        ["saltong-vault-round", { userId, mode, startDate, endDate }],
        filtered
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [localPlayerRounds, userId, mode, startDate, endDate]);

  return useQuery({
    queryKey: ["saltong-vault-rounds", { userId, mode, startDate, endDate }],
    queryFn: async () => {
      if (userId === "unauthenticated") {
        return localPlayerRounds
          .filter(
            (round) =>
              round.mode === mode &&
              round.userId === userId &&
              round.date >= startDate &&
              round.date <= endDate
          )
          .map(
            ({ date, isCorrect, endedAt }) =>
              ({
                date,
                isCorrect,
                endedAt,
              }) satisfies SaltongVaultRound
          );
      }

      const { data, error } = await getSaltongVaultRounds(supabase, {
        userId,
        mode,
        startDate,
        endDate,
      });
      if (error) throw error;
      return data satisfies SaltongVaultRound[];
    },
    enabled: !!userId && !!mode && !!startDate && !!endDate,
  });
}
