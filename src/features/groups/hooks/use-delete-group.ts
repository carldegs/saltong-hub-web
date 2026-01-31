import { useMutation } from "@tanstack/react-query";
import { deleteGroupAction } from "@/features/groups/actions";

export function useDeleteGroup() {
  return useMutation({
    mutationFn: async (groupId: string) => {
      return await deleteGroupAction(groupId);
    },
  });
}
