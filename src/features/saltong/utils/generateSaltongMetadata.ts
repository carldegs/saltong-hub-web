import { Metadata } from "next";
import { getCachedSaltongRound } from "@/features/saltong/queries/getSaltongRound";
import { SALTONG_CONFIG } from "@/features/saltong/config";
import { SaltongMode } from "../types";

export interface SaltongMetadataParams {
  searchParams: Promise<{ d?: string }>;
  mode: SaltongMode;
}

export async function generateSaltongMetadata({
  searchParams,
  mode,
}: SaltongMetadataParams): Promise<Metadata> {
  const params = await searchParams;
  const round = await getCachedSaltongRound(params.d, mode);
  const displayName = SALTONG_CONFIG.modes[mode]?.displayName || "Saltong";

  if (!round) {
    return {
      title: displayName,
    };
  }

  return {
    title: `${displayName} #${round.roundId}`,
  };
}
