import { Database } from "@/lib/supabase/types";
import { SupabaseClient } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";
import { cache } from "react";

export function getGroupById(
  client: SupabaseClient<Database>,
  groupId: string
) {
  return client.from("groups").select().eq("id", groupId).maybeSingle();
}

export const getCachedGroupById = cache(async (groupId: string) => {
  const client = await createClient();
  return await getGroupById(client, groupId);
});

export async function getRecentUserGroups(
  client: SupabaseClient<Database>,
  userId: string
) {
  if (!userId) {
    throw new Error("Unauthorized: User not found");
  }

  const { data, error } = await client
    .from("group_members")
    .select(
      `
    groups (
      id,
      name,
      avatarUrl
    )
  `
    )
    .eq("userId", userId)
    .limit(3);

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []).map((item) => item.groups);
}
