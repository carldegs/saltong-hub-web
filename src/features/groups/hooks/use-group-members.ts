"use client";

import { useQuery } from "@tanstack/react-query";
import { useSupabaseClient } from "@/lib/supabase/client";
import { getGroupMembers } from "../queries/get-group-members";

export function useGroupMembers(
  groupId: string | null,
  enabled: boolean = true
) {
  const supabase = useSupabaseClient();

  return useQuery({
    queryKey: ["group-members", groupId],
    queryFn: async () => {
      if (!groupId) {
        throw new Error("Group ID is required");
      }

      const { data, error } = await getGroupMembers(supabase, groupId);

      if (error) {
        throw new Error(error.message);
      }

      return data;
    },
    enabled: !!groupId && enabled,
  });
}
