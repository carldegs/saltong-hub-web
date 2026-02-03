"use server";

import { createClient } from "@/lib/supabase/server";
import { generateInviteCode } from "./utils/code";
import { joinGroup } from "./queries/join-group";
import { createServiceRoleClient } from "@/lib/supabase/admin-server";

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
      isMember: false,
    };
  }

  return {
    group,
    claims: data.claims,
    isMember: !!isMember,
  };
}

export async function joinGroupAction(groupId: string, inviteCode: string) {
  const supabase = await createClient({
    global: {
      headers: {
        "x-supabase-request-invite-code": inviteCode,
      },
    },
  });

  const { data, error: userError } = await supabase.auth.getClaims();

  if (!data?.claims || userError) {
    if (userError) {
      console.error("Failed to get user:", userError);
    }

    throw new Error("Unauthorized: User not found");
  }

  const response = await joinGroup(supabase, {
    groupId,
    userId: data.claims.sub,
  });

  return response;
}

export async function removeGroupMemberAction(
  groupId: string,
  targetUserId: string
) {
  const supabase = await createClient();
  const supabaseAdmin = await createServiceRoleClient();

  const { data: userData, error: userError } = await supabase.auth.getClaims();

  if (userError || !userData?.claims) {
    throw new Error("Unauthorized: User not found");
  }

  const requesterUserId = userData.claims.sub;

  // Get all members of the group to check roles
  const { data: members, error: membersError } = await supabase
    .from("group_members")
    .select("userId, role")
    .eq("groupId", groupId);

  if (membersError) {
    throw new Error(`Failed to fetch group members: ${membersError.message}`);
  }

  if (!members) {
    throw new Error("Group not found or no members");
  }

  const requesterMember = members.find((m) => m.userId === requesterUserId);
  const targetMember = members.find((m) => m.userId === targetUserId);

  if (!requesterMember) {
    throw new Error("You are not a member of this group");
  }

  if (!targetMember) {
    throw new Error("Target user is not a member of this group");
  }

  const isRequesterAdmin = requesterMember.role === "admin";
  const isRequesterTarget = requesterUserId === targetUserId;

  // Check permissions
  if (isRequesterTarget) {
    // User is leaving the group
    if (isRequesterAdmin) {
      // Check if they are the only admin
      const adminCount = members.filter((m) => m.role === "admin").length;
      if (adminCount === 1) {
        throw new Error(
          "You cannot leave the group as you are the only admin. Promote another member to admin first."
        );
      }
    }
    // Non-admin can always leave
  } else {
    // Requester is trying to remove someone else
    if (!isRequesterAdmin) {
      throw new Error("Only admins can remove other members");
    }
  }

  // Perform the removal
  const { error: deleteError } = await supabaseAdmin
    .from("group_members")
    .delete()
    .eq("groupId", groupId)
    .eq("userId", targetUserId);

  if (deleteError) {
    throw new Error(`Failed to remove member: ${deleteError.message}`);
  }

  return { success: true };
}

export async function updateGroupAction(
  groupId: string,
  updates: {
    name?: string;
    avatarUrl?: string;
    isPublic?: boolean;
    invitesEnabled?: boolean;
  }
) {
  const supabase = await createClient();
  const supabaseAdmin = await createServiceRoleClient();

  const { data: userData, error: userError } = await supabase.auth.getClaims();

  if (userError || !userData?.claims) {
    throw new Error("Unauthorized: User not found");
  }

  const userId = userData.claims.sub;

  // Check if user is an admin of the group
  const { data: memberData, error: memberError } = await supabase
    .from("group_members")
    .select("role")
    .eq("groupId", groupId)
    .eq("userId", userId)
    .single();

  if (memberError || !memberData) {
    throw new Error("You are not a member of this group");
  }

  if (memberData.role !== "admin") {
    throw new Error("Only admins can update group settings");
  }

  // Prepare the update object
  const updateData: Record<string, unknown> = {};

  if (updates.name !== undefined) {
    updateData.name = updates.name;
  }

  if (updates.avatarUrl !== undefined) {
    updateData.avatarUrl = updates.avatarUrl;
  }

  if (updates.isPublic !== undefined) {
    updateData.isPublic = updates.isPublic;
  }

  if (updates.invitesEnabled !== undefined) {
    updateData.invitesEnabled = updates.invitesEnabled;
    if (updates.invitesEnabled) {
      // Generate new invite code
      updateData.inviteCode = generateInviteCode();
    } else {
      // Set invite code to null
      updateData.inviteCode = null;
    }
  }

  // Perform the update
  const { data: groupData, error: updateError } = await supabaseAdmin
    .from("groups")
    .update(updateData)
    .eq("id", groupId)
    .select()
    .single();

  if (updateError) {
    throw new Error(`Failed to update group: ${updateError.message}`);
  }

  return {
    group: groupData,
  };
}

export async function deleteGroupAction(groupId: string) {
  const supabase = await createClient();
  const supabaseAdmin = await createServiceRoleClient();

  // Get the authenticated user
  const { data: userData, error: userError } = await supabase.auth.getClaims();
  if (userError || !userData?.claims) {
    throw new Error("Unauthorized: User not found");
  }
  const userId = userData.claims.sub;

  // Check if user is an admin of the group
  const { data: memberData, error: memberError } = await supabase
    .from("group_members")
    .select("role")
    .eq("groupId", groupId)
    .eq("userId", userId)
    .single();

  if (memberError || !memberData) {
    throw new Error("You are not a member of this group");
  }
  if (memberData.role !== "admin") {
    throw new Error("Only admins can delete the group");
  }

  // Delete the group (cascades to group_members, etc. if FK is set)
  const { error: deleteError } = await supabaseAdmin
    .from("groups")
    .delete()
    .eq("id", groupId);

  if (deleteError) {
    throw new Error(`Failed to delete group: ${deleteError.message}`);
  }

  return { success: true };
}
