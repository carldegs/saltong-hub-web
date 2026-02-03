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
  const description = `Play ${displayName} on Saltong Hub.`;

  if (!round) {
    return {
      title: displayName,
      description,
      openGraph: {
        title: displayName,
        description,
        type: "website",
        url: `https://saltong.com/play${mode === "classic" ? "" : `/${mode}`}`,
      },
    };
  }

  return {
    title: `${displayName} #${round.roundId}`,
    description: `Play ${displayName} #${round.roundId} on Saltong Hub.`,
    openGraph: {
      title: `${displayName} #${round.roundId}`,
      description: `Play ${displayName} #${round.roundId} on Saltong Hub.`,
      type: "website",
      url: `https://saltong.com/play${mode === "classic" ? "" : `/${mode}`}`,
    },
  };
}
