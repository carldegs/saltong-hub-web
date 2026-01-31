"use client";

import { useQuery } from "@tanstack/react-query";
import {
  getLeaderboards,
  type GetLeaderboardsParams,
} from "../queries/get-leaderboards";
import { useSupabaseClient } from "@/lib/supabase/client";

export function useLeaderboards(params: GetLeaderboardsParams) {
  const client = useSupabaseClient();
  return useQuery({
    queryKey: ["leaderboards", params],
    queryFn: async () => {
      const { data, error } = await getLeaderboards(client, params);

      if (error) {
        throw new Error(error.message);
      }

      return data;
    },
    enabled: !!params.groupId && !!params.date && !!params.mode,
  });
}
