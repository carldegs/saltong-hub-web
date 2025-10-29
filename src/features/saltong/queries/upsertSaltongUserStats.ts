import { Database } from "@/lib/supabase/types";
import { SupabaseClient } from "@supabase/supabase-js";
import { SaltongUserStats } from "../types";

export default function upsertSaltongUserStats(
  client: SupabaseClient<Database>,
  params: Omit<SaltongUserStats, "createdAt" | "updatedAt"> & {
    createdAt?: SaltongUserStats["createdAt"];
  }
) {
  return client.from("saltong-user-stats").upsert({
    ...params,
    updatedAt: new Date().toISOString(),
  });
}
