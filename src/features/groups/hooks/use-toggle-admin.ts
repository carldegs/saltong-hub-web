import { useSupabaseClient } from "@/lib/supabase/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toggleGroupAdmin } from "../queries/toggle-admin";
import { GroupMemberWithProfile } from "../types";

export function useToggleGroupAdmin() {
  const supabase = useSupabaseClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: {
      groupId: string;
      targetUserId: string;
      role: "admin" | "member";
    }) => {
      const { error } = await toggleGroupAdmin(
        supabase,
        params.groupId,
        params.targetUserId,
        params.role
      );

      if (error) {
        throw new Error(error.message);
      }

      return { success: true };
    },
    onMutate: async (params) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({
        queryKey: ["group-members", params.groupId],
      });

      // Snapshot the previous value
      const previousMembers = queryClient.getQueryData<
        GroupMemberWithProfile[]
      >(["group-members", params.groupId]);

      // Optimistically update the cache
      queryClient.setQueryData<GroupMemberWithProfile[]>(
        ["group-members", params.groupId],
        (old) => {
          if (!old) return old;
          return old.map((member) =>
            member.userId === params.targetUserId
              ? { ...member, role: params.role }
              : member
          );
        }
      );

      // Return a context object with the snapshotted value
      return { previousMembers };
    },
    onError: (err, params, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      if (context?.previousMembers) {
        queryClient.setQueryData(
          ["group-members", params.groupId],
          context.previousMembers
        );
      }
    },
    onSuccess: (data, params) => {
      // Always refetch after error or success to ensure consistency
      queryClient.invalidateQueries({
        queryKey: ["group-members", params.groupId],
      });
    },
  });
}
