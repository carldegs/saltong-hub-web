"use server";

import { createClient } from "@/lib/supabase/server";
import { generateInviteCode } from "./utils/code";
import { getProfileById } from "../profiles/queries/get-profile";

export async function createGroupAction(groupName: string) {
  const supabase = await createClient();

  // Get the authenticated user
  const { data, error: userError } = await supabase.auth.getClaims();

  if (userError || !data?.claims) {
    throw new Error("Unauthorized: User not found");
  }

  const userId = data.claims?.sub;
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

export async function getGroupByInviteCode(inviteCode: string) {
  const supabase = await createClient({
    global: {
      headers: {
        "x-supabase-request-invite-code": inviteCode,
      },
    },
  });

  const { data: group } = await supabase
    .from("groups")
    .select("name, id, avatarUrl, memberCount")
    .eq("inviteCode", inviteCode)
    .maybeSingle();

  if (!group) {
    throw new Error("Group not found");
  }

  const { data, error: userError } = await supabase.auth.getClaims();

  if (userError || !data?.claims) {
    if (userError) {
      console.error("Failed to get user:", userError);
    }
    return {
      group,
      claims: null,
    };
  }

  const userId = data.claims?.sub;
  const { data: profile } = await getProfileById(supabase, userId);

  const { data: isMember, error: isMemberError } = await supabase.rpc(
    "is_group_member",
    {
      p_group: group.id,
      p_user: userId,
    }
  );

  if (isMemberError) {
    console.error("Failed to check group membership:", isMemberError);
    return {
      group,
      claims: data.claims,
      profile,
      isMember: false,
    };
  }

  return {
    group,
    claims: data.claims,
    profile,
    isMember: !!isMember,
  };
}
