import { Database } from "@/lib/supabase/types";
import { SupabaseClient } from "@supabase/supabase-js";

export function toggleGroupAdmin(
  client: SupabaseClient<Database>,
  groupId: string,
  targetUserId: string,
  role: "admin" | "member"
) {
  return client
    .from("group_members")
    .update({ role })
    .eq("groupId", groupId)
    .eq("userId", targetUserId);
}
