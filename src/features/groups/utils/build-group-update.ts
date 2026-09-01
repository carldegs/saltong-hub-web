import type { Database } from "@/lib/supabase/types";
import { generateInviteCode } from "./code";

export type GroupSettingsUpdate = {
  name?: string;
  avatarUrl?: string;
  hideUnsolvedMembers?: boolean;
  isPublic?: boolean;
  invitesEnabled?: boolean;
};

export function buildGroupUpdateData(
  updates: GroupSettingsUpdate
): Database["public"]["Tables"]["groups"]["Update"] {
  const updateData: Database["public"]["Tables"]["groups"]["Update"] = {};

  if (updates.name !== undefined) {
    updateData.name = updates.name;
  }

  if (updates.avatarUrl !== undefined) {
    updateData.avatarUrl = updates.avatarUrl;
  }

  if (updates.hideUnsolvedMembers !== undefined) {
    updateData.hideUnsolvedMembers = updates.hideUnsolvedMembers;
  }

  if (updates.isPublic !== undefined) {
    updateData.isPublic = updates.isPublic;
  }

  if (updates.invitesEnabled !== undefined) {
    updateData.invitesEnabled = updates.invitesEnabled;
    updateData.inviteCode = generateInviteCode();
  }

  return updateData;
}
