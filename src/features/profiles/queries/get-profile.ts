import { Database } from "@/lib/supabase/types";
import { SupabaseClient } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";
import { cache } from "react";

export function getProfileById(
  client: SupabaseClient<Database>,
  userId: string
) {
  return client.from("profiles").select().eq("id", userId).maybeSingle();
}

export function getProfileByUsername(
  client: SupabaseClient<Database>,
  username: string
) {
  return client
    .from("profiles")
    .select()
    .eq("username", username)
    .maybeSingle();
}

export const getCachedProfileById = cache(async (userId: string) => {
  const client = await createClient();
  return await getProfileById(client, userId);
});

export const getCachedProfileByUsername = cache(async (username: string) => {
  const client = await createClient();
  return await getProfileByUsername(client, username);
});
