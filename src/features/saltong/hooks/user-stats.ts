import { useEffect } from "react";
import { useSupabaseClient } from "@/lib/supabase/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  SaltongUserStats,
  SaltongUserStatsPrimaryKeys,
  SaltongMode,
  SaltongUserRound,
} from "../types";
import getSaltongUserStats from "../queries/getSaltongUserStats";
import { useLocalStorage } from "usehooks-ts";
import upsertSaltongUserStats from "../queries/upsertSaltongUserStats";
import { computeSaltongUserStats } from "../utils/computeSaltongUserStats";

export function useSaltongUserStats(params: SaltongUserStatsPrimaryKeys) {
  // TODO(persistence): Consider removing direct useLocalStorage usage and instead
  // rely on @tanstack/react-query-persist-client to persist the query cache.
  // This would unify unauthenticated + authenticated flows and eliminate the
  // hydration effect + manual cache sync logic.

  const [localPlayerStats] = useLocalStorage<SaltongUserStats[]>(
    "saltong-user-stats",
    [],
    {
      initializeWithValue: false,
    }
  );

  const supabase = useSupabaseClient();
  const queryClient = useQueryClient();

  // Ensure cache updates once localStorage hydrates (since initializeWithValue:false returns empty first render)
  useEffect(() => {
    if (params.userId === "unauthenticated") {
      const data =
        localPlayerStats.find(
          (stat) => stat.mode === params.mode && stat.userId === params.userId
        ) ?? null;
      queryClient.setQueryData(["saltong-user-stats", params], data);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [localPlayerStats, params.userId, params.mode]);

  return useQuery({
    queryKey: ["saltong-user-stats", params],
    queryFn: async () => {
      if (params.userId === "unauthenticated") {
        const data =
          localPlayerStats.find(
            (stat) => stat.mode === params.mode && stat.userId === params.userId
          ) ?? null;
        return data;
      }

      return (await getSaltongUserStats(supabase, params))?.data;
    },
    enabled: !!params.userId && !!params.mode,
  });
}

export function useSaltongUserStatsMutation() {
  const [localPlayerStats, setLocalPlayerStats] = useLocalStorage<
    SaltongUserStats[]
  >("saltong-user-stats", [], {
    initializeWithValue: false,
  });

  const supabase = useSupabaseClient();
  const queryClient = useQueryClient();

  // TODO: userId should not be passed as a parameter!
  return useMutation({
    mutationFn: async (params: {
      userId: string;
      mode: SaltongMode;
      roundData: Pick<
        SaltongUserRound,
        "isCorrect" | "solvedTurn" | "solvedLive" | "date"
      > & { roundId?: number };
    }) => {
      const { userId, mode, roundData } = params;

      // Get current stats
      let currentStats: SaltongUserStats | undefined;
      if (userId === "unauthenticated") {
        currentStats = localPlayerStats.find(
          (stat) => stat.mode === mode && stat.userId === userId
        );
      } else {
        const { data } = await getSaltongUserStats(supabase, { userId, mode });
        currentStats = data ?? undefined;
      }

      // Compute new stats
      const updatedStatsFields = computeSaltongUserStats({
        prev: currentStats,
        data: roundData,
        mode,
      });

      const newStats: SaltongUserStats = {
        ...updatedStatsFields,
        userId,
        mode,
      };

      // Save to localStorage or database
      if (userId === "unauthenticated") {
        setLocalPlayerStats((prev) => {
          const existingIndex = prev.findIndex(
            (stat) => stat.mode === mode && stat.userId === userId
          );

          if (existingIndex > -1) {
            const updated = [...prev];
            updated[existingIndex] = newStats;
            return updated;
          }

          return [...prev, newStats];
        });
      } else {
        const response = await upsertSaltongUserStats(supabase, newStats);
        return response;
      }
    },
    onMutate: async (params) => {
      const { userId, mode, roundData } = params;

      // Only perform optimistic update for authenticated users (server upsert)
      if (userId === "unauthenticated") {
        return;
      }

      const primaryKeys = {
        userId,
        mode,
      } satisfies SaltongUserStatsPrimaryKeys;

      // cancel any outgoing refetches (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({
        queryKey: ["saltong-user-stats", primaryKeys],
      });

      const previous = queryClient.getQueryData([
        "saltong-user-stats",
        primaryKeys,
      ]);

      // Get current stats for optimistic computation
      const currentStats = previous as SaltongUserStats | undefined;

      // Compute new stats optimistically
      const updatedStatsFields = computeSaltongUserStats({
        prev: currentStats,
        data: roundData,
        mode,
      });

      const optimistic: SaltongUserStats = {
        ...updatedStatsFields,
        userId,
        mode,
      };

      queryClient.setQueryData(["saltong-user-stats", primaryKeys], optimistic);

      return { previous };
    },
    onError: (_err, params, context) => {
      const { userId, mode } = params;

      // Only need to rollback query cache for authenticated users
      if (userId === "unauthenticated") return;

      const primaryKeys = {
        userId,
        mode,
      } satisfies SaltongUserStatsPrimaryKeys;

      if (context?.previous) {
        queryClient.setQueryData(
          ["saltong-user-stats", primaryKeys],
          context.previous
        );
      } else {
        queryClient.invalidateQueries({
          queryKey: ["saltong-user-stats", primaryKeys],
        });
      }
    },
    onSettled: (data, error, params) => {
      const { userId, mode } = params;

      // always invalidate so fresh data is fetched from server for authenticated users
      if (userId !== "unauthenticated") {
        const primaryKeys = {
          userId,
          mode,
        } satisfies SaltongUserStatsPrimaryKeys;

        queryClient.invalidateQueries({
          queryKey: ["saltong-user-stats", primaryKeys],
        });
      }
    },
  });
}
