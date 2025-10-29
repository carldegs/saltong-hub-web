import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "@/lib/supabase/types";
import { SaltongVaultRoundsParams } from "../types";

/**
 * Query saltong-user-rounds for a user, mode, and date range, returning only date, isCorrect, endedAt.
 */
export function getSaltongVaultRounds(
  client: SupabaseClient<Database>,
  params: SaltongVaultRoundsParams
) {
  const { userId, mode, startDate, endDate } = params;
  return client
    .from("saltong-user-rounds")
    .select("date, isCorrect, endedAt")
    .eq("userId", userId)
    .eq("mode", mode)
    .gte("date", startDate)
    .lte("date", endDate);
}
