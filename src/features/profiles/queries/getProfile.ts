import { Database } from "@/lib/supabase/types";
import { SupabaseClient } from "@supabase/supabase-js";

// For now, just fetch all user's stats. In the future, we also need to fetch user profile data from a public profiles table.
export default function getSaltongProfileStats(
  client: SupabaseClient<Database>,
  userId: string
) {
  return client.from("saltong-user-stats").select().match({ userId });
}
