import { Database } from "@/lib/supabase/types";
import { SupabaseClient } from "@supabase/supabase-js";

export function getUserGroupRole(
  client: SupabaseClient<Database>,
  groupId: string,
  userId: string
) {
  return client
    .from("group_members")
    .select("role")
    .eq("groupId", groupId)
    .eq("userId", userId)
    .maybeSingle();
}
