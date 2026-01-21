import { Database } from "@/lib/supabase/types";
import { SupabaseClient } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";

export function getGroupMembers(
  client: SupabaseClient<Database>,
  groupId: string
) {
  return client
    .from("group_members")
    .select("*, profiles(*)")
    .eq("group_id", groupId);
}

export async function getCachedGroupMembers(groupId: string) {
  const client = await createClient();
  return await getGroupMembers(client, groupId);
}
