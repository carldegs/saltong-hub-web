import { useSupabaseClient } from "@/lib/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { SaltongVaultRound, SaltongVaultRoundsParams } from "../types";
import { getSaltongVaultRounds } from "../queries/getSaltongVaultRounds";

/**
 * Fetches user rounds in a date range for a given user and mode.
 * Returns only { date, isCorrect, endedAt } for each round.
 */
export function useSaltongVaultRounds(params: SaltongVaultRoundsParams) {
  const { userId, mode, startDate, endDate } = params;
  const supabase = useSupabaseClient();

  return useQuery({
    queryKey: ["saltong-vault-rounds", { userId, mode, startDate, endDate }],
    queryFn: async () => {
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
