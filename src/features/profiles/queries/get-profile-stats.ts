import { Database } from "@/lib/supabase/types";
import { SupabaseClient } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";
import { cache } from "react";

// For now, just fetch all user's stats. In the future, we also need to fetch user profile data from a public profiles table.
export default function getSaltongProfileStats(
  client: SupabaseClient<Database>,
  userId: string
) {
  return client.from("saltong-user-stats").select().match({ userId });
}

export const getCachedSaltongProfileStats = cache(async (userId: string) => {
  const client = await createClient();
  return await getSaltongProfileStats(client, userId);
});
