import { Metadata } from "next";
import { getCachedSaltongRound } from "@/features/saltong/queries/getSaltongRound";
import { SALTONG_CONFIG } from "@/features/saltong/config";
import { canonicalUrl } from "@/lib/seo";
import type { SaltongMode } from "../types";
import { getSaltongGameSeo } from "./game-seo";

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
  const { description, indexing, path } = getSaltongGameSeo(
    mode,
    Boolean(params.d)
  );

  if (!round) {
    return {
      title: displayName,
      description,
      ...indexing,
      openGraph: {
        title: displayName,
        description,
        type: "website",
        url: canonicalUrl(path),
      },
    };
  }

  return {
    title: `${displayName} #${round.roundId}`,
    description,
    ...indexing,
    openGraph: {
      title: `${displayName} #${round.roundId}`,
      description,
      type: "website",
      url: canonicalUrl(path),
    },
  };
}
