import { createClient } from "@/lib/supabase/server";
import { Database } from "@/lib/supabase/types";
import { SupabaseClient } from "@supabase/supabase-js";
import { HexRound } from "../types";

export async function getHexRecentRounds(
  client: SupabaseClient<Database>,
  limit = 200
) {
  return client
    .from("saltong-hex-rounds")
    .select(
      "date, centerLetter, rootWord, words, roundId, createdAt, maxScore, numWords, numPangrams, wordId"
    )
    .order("date", { ascending: false })
    .limit(limit);
}

export async function getCachedHexRecentRounds(
  limit = 200
): Promise<HexRound[]> {
  const client = await createClient();
  const { data, error } = await getHexRecentRounds(client, limit);
  if (error) throw error;
  // Ensure all returned objects are plain objects
  return Array.isArray(data) ? data.map((r) => ({ ...r })) : [];
}
