import { Database } from "@/lib/supabase/types";
import { SupabaseClient } from "@supabase/supabase-js";
import { Profile } from "../types";

export function upsertProfile(
  client: SupabaseClient<Database>,
  profile: Omit<Profile, "created_at" | "updated_at">
) {
  return client.from("profiles").upsert(profile).select().single();
}
