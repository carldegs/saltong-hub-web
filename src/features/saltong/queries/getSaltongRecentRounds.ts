import { createClient } from "@/lib/supabase/server";
import { Database } from "@/lib/supabase/types";
import { SupabaseClient } from "@supabase/supabase-js";
import { SaltongMode, SaltongRound } from "../types";

export async function getSaltongRecentRounds(
  client: SupabaseClient<Database>,
  mode: SaltongMode,
  limit = 365
) {
  return client
    .from("saltong-rounds")
    .select("date, word, roundId, mode, createdAt")
    .eq("mode", mode)
    .order("date", { ascending: false })
    .limit(limit);
}

export async function getCachedSaltongRecentRounds(
  mode: SaltongMode,
  limit = 365
): Promise<SaltongRound[]> {
  const client = await createClient();
  const { data, error } = await getSaltongRecentRounds(client, mode, limit);
  if (error) throw error;
  return data ?? [];
}
