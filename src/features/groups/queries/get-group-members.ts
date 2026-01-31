import { Database } from "@/lib/supabase/types";
import { SupabaseClient } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";

export function getGroupMembers(
  client: SupabaseClient<Database>,
  groupId: string
) {
  return client
    .from("group_members")
    .select("userId, role, profiles ( id, username, avatar_url, display_name )")
    .eq("groupId", groupId);
}

export async function getCachedGroupMembers(groupId: string) {
  const client = await createClient();
  return await getGroupMembers(client, groupId);
}
