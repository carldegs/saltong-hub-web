"use server";

import { createClient } from "@/lib/supabase/server";
import { generateInviteCode } from "./utils/code";

export async function createGroupAction(groupName: string) {
  const supabase = await createClient();

  // Get the authenticated user
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    throw new Error("Unauthorized: User not found");
  }

  const userId = user.id;
  const inviteCode = generateInviteCode();

  // Create the group (and corresponding group_members entry for the creator)
  const { data: groupData, error: groupError } = await supabase
    .from("groups")
    .insert({
      name: groupName,
      inviteCode: inviteCode,
      avatarUrl: `ba://${groupName.toLowerCase().replace(/\s+/g, "-")}-avatar.png`,
      createdBy: userId,
      invitesEnabled: true,
      isPublic: false,
    })
    .select()
    .single();

  if (groupError) {
    throw new Error(`Failed to create group: ${groupError.message}`);
  }

  return {
    group: groupData,
  };
}
