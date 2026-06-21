import { useSupabaseClient } from "@/lib/supabase/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { GroupMember, Profile } from "../types";
import { insertProfile } from "@/features/profiles/queries/insert-profile";
import { joinGroupAction } from "../actions";

export function useJoinGroup() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: { groupId: string; inviteCode: string }) => {
      const { data, error } = await joinGroupAction(
        params.groupId,
        params.inviteCode
      );

      if (error) {
        throw new Error(error.message);
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-groups"] });
      queryClient.invalidateQueries({ queryKey: ["leaderboards"] });
      queryClient.invalidateQueries({ queryKey: ["group-leaderboards"] });
    },
  });
}

export function useInsertProfileAndJoinGroupMutation() {
  const supabase = useSupabaseClient();

  return useMutation({
    mutationFn: async (params: {
      profile: Omit<Profile, "created_at" | "updated_at">;
      groupMember: Omit<GroupMember, "joinedAt" | "role">;
      inviteCode: string;
    }) => {
      const { data: insertProfileData, error: insertProfileError } =
        await insertProfile(supabase, params.profile);

      if (insertProfileError) {
        throw new Error(insertProfileError.message);
      }

      const { data: joinGroupData, error: joinGroupError } =
        await joinGroupAction(params.groupMember.groupId, params.inviteCode);

      if (joinGroupError) {
        throw new Error(joinGroupError.message);
      }

      return { insertProfileData, joinGroupData };
    },
  });
}
