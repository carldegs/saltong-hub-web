import { Database } from "@/lib/supabase/types";
import { SupabaseClient } from "@supabase/supabase-js";
import { SaltongUserRound } from "../types";

export default function upsertSaltongUserRound(
  client: SupabaseClient<Database>,
  params: Omit<SaltongUserRound, "startedAt" | "updatedAt"> & {
    startedAt?: SaltongUserRound["startedAt"];
  }
) {
  return client.from("saltong-user-rounds").upsert({
    ...params,
    startedAt: params.startedAt ?? new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });
}
