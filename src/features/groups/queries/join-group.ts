import { Database } from "@/lib/supabase/types";
import { SupabaseClient } from "@supabase/supabase-js";
import { GroupMember } from "../types";

export function joinGroup(
  client: SupabaseClient<Database>,
  data: Omit<GroupMember, "joinedAt" | "role">
) {
  return client.from("group_members").upsert(
    {
      ...data,
      joinedAt: new Date().toISOString(),
      role: "member",
    },
    {
      ignoreDuplicates: true,
      onConflict: "groupId,userId",
    }
  );
}
