"use client";

import { useQuery } from "@tanstack/react-query";
import { useSupabaseClient } from "@/lib/supabase/client";
import { getGroupById } from "../queries/get-group";

export function useGroup(groupId: string | null) {
  const supabase = useSupabaseClient();

  return useQuery({
    queryKey: ["group", groupId],
    queryFn: async () => {
      if (!groupId) {
        throw new Error("Group ID is required");
      }

      const { data, error } = await getGroupById(supabase, groupId);

      if (error) {
        throw new Error(error.message);
      }

      return data;
    },
    enabled: !!groupId,
  });
}
