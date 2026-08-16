import { pageIndexingMetadata } from "@/lib/seo";
import type { SaltongMode } from "../types";

const GAME_SEO = {
  classic: {
    path: "/play",
    description: "Play Saltong, a daily Filipino word game.",
  },
  mini: {
    path: "/play/mini",
    description: "Play Saltong Mini, a daily Filipino word-game variant.",
  },
  max: {
    path: "/play/max",
    description: "Play Saltong Max, a daily Filipino word-game variant.",
  },
} satisfies Record<SaltongMode, { path: string; description: string }>;

export function getSaltongGameSeo(mode: SaltongMode, dated: boolean) {
  const game = GAME_SEO[mode];

  return { ...game, indexing: pageIndexingMetadata(game.path, !dated) };
}
