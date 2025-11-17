import { useMutation, useQuery } from "@tanstack/react-query";
import {
  fetchLookupTableMetadata,
  getHexLookupTable,
  triggerLookupTableRegeneration,
} from "../queries/hex-lookup-table";

export function useHexLookupTableData() {
  return useQuery({
    queryKey: ["hex-lookup-table"],
    queryFn: getHexLookupTable,
    staleTime: Infinity, // Lookup table doesn't change unless regenerated
    retry: 0,
  });
}

export function useHexLookupTableStatus() {
  // Query for metadata
  const {
    data: metadata,
    refetch: refetchMetadata,
    isLoading: isLoadingMetadata,
  } = useQuery({
    queryKey: ["hex-lookup-table-metadata"],
    queryFn: fetchLookupTableMetadata,
    retry: 1,
  });

  // Mutation for triggering regeneration
  const regenerateMutation = useMutation({
    mutationFn: triggerLookupTableRegeneration,
    onSuccess: () => {
      refetchMetadata();
    },
  });

  return {
    metadata,
    isLoadingMetadata,
    regenerate: regenerateMutation.mutate,
    isRegenerating:
      regenerateMutation.isPending || metadata?.status === "generating",
    refetchMetadata,
  };
}
