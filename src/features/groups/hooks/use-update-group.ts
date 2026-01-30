import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateGroupAction } from "../actions";

export function useUpdateGroup() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: {
      groupId: string;
      updates: {
        name?: string;
        avatarUrl?: string;
        isPublic?: boolean;
        invitesEnabled?: boolean;
      };
    }) => {
      return await updateGroupAction(params.groupId, params.updates);
    },
    onSuccess: (data, params) => {
      // Update the cache with the server response
      queryClient.setQueryData(["group", params.groupId], data.group);

      // Invalidate related queries
      queryClient.invalidateQueries({
        queryKey: ["group", params.groupId],
      });
    },
  });
}
