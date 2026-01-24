import { createClient } from "@/lib/supabase/server";
import { cache } from "react";
import { type DbClient } from "@/lib/supabase/client-type";

export function getProfileById(client: DbClient, userId: string) {
  return client.from("profiles").select().eq("id", userId).maybeSingle();
}

export function getProfileByUsername(client: DbClient, username: string) {
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
