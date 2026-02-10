import { useEffect } from "react";
import { useLocalStorage, useReadLocalStorage } from "usehooks-ts";
import { SaltongUserRound, SaltongUserRoundPrimaryKeys } from "../types";
import { useSupabaseClient } from "@/lib/supabase/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import getSaltongUserRound from "../queries/getSaltongUserRound";
import upsertSaltongUserRound from "../queries/upsertSaltongUserRound";

export function useSaltongUserRound(params: SaltongUserRoundPrimaryKeys) {
  // TODO(persistence): Consider removing direct useLocalStorage usage and instead
  // rely on @tanstack/react-query-persist-client to persist the query cache.
  // This would unify unauthenticated + authenticated flows and eliminate the
  // hydration effect + manual cache sync logic.

  const localPlayerRound = useReadLocalStorage<SaltongUserRound[]>(
    "saltong-user-rounds"
  );

  const supabase = useSupabaseClient();
  const queryClient = useQueryClient();

  // Ensure cache updates once localStorage hydrates (since initializeWithValue:false returns empty first render)
  useEffect(() => {
    if (params.userId === "unauthenticated") {
      const data =
        localPlayerRound?.find(
          (round) =>
            round.mode === params.mode &&
            round.userId === params.userId &&
            round.date === params.date
        ) ?? null;
      queryClient.setQueryData(["saltong-user-round", params], data);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [localPlayerRound, params.userId, params.mode, params.date]);

  return useQuery({
    queryKey: ["saltong-user-round", params],
    queryFn: async () => {
      if (params.userId === "unauthenticated") {
        const data =
          localPlayerRound?.find(
            (round) =>
              round.mode === params.mode && round.userId === params.userId
          ) ?? null;
        return data;
      }

      return (await getSaltongUserRound(supabase, params)).data;
    },
  });
}

export function useSaltongUserRoundMutation() {
  const [, setLocalPlayerRound] = useLocalStorage<SaltongUserRound[]>(
    "saltong-user-rounds",
    [],
    {
      initializeWithValue: false,
    }
  );

  const supabase = useSupabaseClient();
  const queryClient = useQueryClient();

  // TODO: userId should not be passed as a parameter!
  return useMutation({
    mutationFn: async (
      params: Omit<SaltongUserRound, "startedAt" | "updatedAt"> & {
        startedAt?: SaltongUserRound["startedAt"];
      }
    ) => {
      if (params.userId === "unauthenticated") {
        setLocalPlayerRound((prev) => {
          const existingIndex = prev.findIndex(
            (round) =>
              round.mode === params.mode && round.userId === params.userId
          );

          const datedParams = {
            ...params,
            startedAt: params.startedAt ?? new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };

          if (existingIndex > -1) {
            const updatedRounds = [...prev];
            updatedRounds[existingIndex] = {
              ...updatedRounds[existingIndex],
              ...datedParams,
            };
            return updatedRounds;
          }

          return [...prev, datedParams];
        });
      } else {
        const response = await upsertSaltongUserRound(supabase, params);
        return response;
      }
    },
    onMutate: async (params) => {
      // Only perform optimistic update for authenticated users (server upsert)
      if (params.userId === "unauthenticated") {
        return;
      }

      const primaryKeys = {
        userId: params.userId,
        date: params.date,
        mode: params.mode,
      } satisfies SaltongUserRoundPrimaryKeys;

      // cancel any outgoing refetches (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({
        queryKey: ["saltong-user-round", primaryKeys],
      });

      const previous = queryClient.getQueryData([
        "saltong-user-round",
        primaryKeys,
      ]);

      // set optimistic value
      const optimistic = {
        ...params,
        startedAt: params.startedAt ?? new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      } as SaltongUserRound;

      queryClient.setQueryData(["saltong-user-round", primaryKeys], optimistic);

      return { previous };
    },
    onError: (_err, params, context) => {
      // Only need to rollback query cache for authenticated users
      if (params.userId === "unauthenticated") return;

      const primaryKeys = {
        userId: params.userId,
        date: params.date,
        mode: params.mode,
      } satisfies SaltongUserRoundPrimaryKeys;

      if (context?.previous) {
        queryClient.setQueryData(
          ["saltong-user-round", primaryKeys],
          context.previous
        );
      } else {
        queryClient.invalidateQueries({
          queryKey: ["saltong-user-round", primaryKeys],
        });
      }
    },
    onSettled: (data, error, params) => {
      // always invalidate so fresh data is fetched from server for authenticated users
      if (params.userId !== "unauthenticated") {
        const primaryKeys = {
          userId: params.userId,
          date: params.date,
          mode: params.mode,
        } satisfies SaltongUserRoundPrimaryKeys;

        queryClient.invalidateQueries({
          queryKey: ["saltong-user-round", primaryKeys],
        });
      }
    },
  });
}
