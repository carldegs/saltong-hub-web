import { Database } from "@/lib/supabase/types";
import { SupabaseClient } from "@supabase/supabase-js";
import { SaltongUserStatsPrimaryKeys } from "../types";

export default function getSaltongUserStats(
  client: SupabaseClient<Database>,
  params: SaltongUserStatsPrimaryKeys
) {
  return client.from("saltong-user-stats").select().match(params).maybeSingle();
}
