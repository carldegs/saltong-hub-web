import { Database } from "@/lib/supabase/types";
import { SupabaseClient } from "@supabase/supabase-js";

export interface GetHexVaultRoundsParams {
  userId: string;
  startDate: string; // inclusive YYYY-MM-DD
  endDate: string; // inclusive YYYY-MM-DD
}

export async function getHexVaultRounds(
  client: SupabaseClient<Database>,
  params: GetHexVaultRoundsParams
) {
  const { userId, startDate, endDate } = params;

  return client
    .from("saltong-hex-user-rounds")
    .select("date, liveScore, guessedWords, updatedAt, isRevealed, isTopRank")
    .eq("userId", userId)
    .gte("date", startDate)
    .lte("date", endDate)
    .order("date", { ascending: true });
}
