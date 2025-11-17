import { useQuery } from "@tanstack/react-query";
import { useSupabaseClient } from "@/lib/supabase/client";

import { getHexRecentRounds } from "../queries/getHexRecentRounds";

export function useGetHexRecentRounds(limit: number) {
  const supabase = useSupabaseClient();

  return useQuery({
    queryKey: ["hex-recent-rounds", { limit }],
    queryFn: async () => {
      const { data, error } = await getHexRecentRounds(supabase, limit);
      if (error) throw error;
      return data ?? [];
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}
