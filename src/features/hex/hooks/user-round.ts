import { useEffect } from "react";
import { useLocalStorage, useReadLocalStorage } from "usehooks-ts";
import {
  HexUserRound,
  HexUserRoundPrimaryKeys,
  TransformedHexUserRound,
} from "../types";
import { useSupabaseClient } from "@/lib/supabase/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import getHexUserRound from "../queries/getHexUserRound";
import upsertHexUserRound from "../queries/upsertHexUserRound";

export function useHexUserRound(params: HexUserRoundPrimaryKeys) {
  // TODO(persistence): Consider removing direct useLocalStorage usage and instead
  // rely on @tanstack/react-query-persist-client to persist the query cache.
  // This would unify unauthenticated + authenticated flows and eliminate the
  // hydration effect + manual cache sync logic.

  const localPlayerRound =
    useReadLocalStorage<HexUserRound[]>("hex-user-rounds");

  const supabase = useSupabaseClient();
  const queryClient = useQueryClient();

  // Ensure cache updates once localStorage hydrates (since initializeWithValue:false returns empty first render)
  useEffect(() => {
    if (params.userId === "unauthenticated") {
      const data =
        localPlayerRound?.find(
          (round) =>
            round.userId === params.userId && round.date === params.date
        ) ?? null;
      queryClient.setQueryData(["hex-user-round", params], data);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [localPlayerRound, params.userId, params.date]);

  return useQuery({
    queryKey: ["hex-user-round", params],
    queryFn: async () => {
      if (params.userId === "unauthenticated") {
        const data =
          localPlayerRound?.find(
            (round) =>
              round.userId === params.userId && round.date === params.date
          ) ?? null;
        return data;
      }

      return (await getHexUserRound(supabase, params)).data;
    },
    select: (data) => {
      if (!data) return null;

      const d = data as HexUserRound;

      return {
        ...d,
        guessedWords: d.guessedWords
          ? d.guessedWords.split(",")
          : ([] as string[]),
      } satisfies TransformedHexUserRound;
    },
  });
}

export function useHexUserRoundMutation() {
  const [, setLocalPlayerRound] = useLocalStorage<HexUserRound[]>(
    "hex-user-rounds",
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
      params: Omit<HexUserRound, "startedAt" | "updatedAt"> & {
        startedAt?: HexUserRound["startedAt"];
      }
    ) => {
      if (params.userId === "unauthenticated") {
        setLocalPlayerRound((prev) => {
          const existingIndex = prev.findIndex(
            (round) =>
              round.userId === params.userId && round.date === params.date
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
        const response = await upsertHexUserRound(supabase, params);
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
      } satisfies HexUserRoundPrimaryKeys;

      // cancel any outgoing refetches (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({
        queryKey: ["hex-user-round", primaryKeys],
      });

      const previous = queryClient.getQueryData([
        "hex-user-round",
        primaryKeys,
      ]);

      // set optimistic value
      const optimistic = {
        ...params,
        startedAt: params.startedAt ?? new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      } as HexUserRound;

      queryClient.setQueryData(["hex-user-round", primaryKeys], optimistic);

      return { previous };
    },
    onError: (_err, params, context) => {
      // Only need to rollback query cache for authenticated users
      if (params.userId === "unauthenticated") return;

      const primaryKeys = {
        userId: params.userId,
        date: params.date,
      } satisfies HexUserRoundPrimaryKeys;

      if (context?.previous) {
        queryClient.setQueryData(
          ["hex-user-round", primaryKeys],
          context.previous
        );
      } else {
        queryClient.invalidateQueries({
          queryKey: ["hex-user-round", primaryKeys],
        });
      }
    },
    onSettled: (data, error, params) => {
      // always invalidate so fresh data is fetched from server for authenticated users
      if (params.userId !== "unauthenticated") {
        const primaryKeys = {
          userId: params.userId,
          date: params.date,
        } satisfies HexUserRoundPrimaryKeys;

        queryClient.invalidateQueries({
          queryKey: ["hex-user-round", primaryKeys],
        });
      }
    },
  });
}
