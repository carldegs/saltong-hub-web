import { Database } from "@/lib/supabase/types";
import { SupabaseClient } from "@supabase/supabase-js";
import { HexUserRound } from "../types";

export default function upsertHexUserRound(
  client: SupabaseClient<Database>,
  params: Omit<HexUserRound, "startedAt" | "updatedAt"> & {
    startedAt?: HexUserRound["startedAt"];
  }
) {
  return client.from("saltong-hex-user-rounds").upsert({
    ...params,
    startedAt: params.startedAt ?? new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });
}
