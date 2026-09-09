import { HEX_CONFIG } from "@/features/hex/config";
import { MATHINIK_CONFIG } from "@/features/mathinik/config";
import { SALTONG_CONFIG } from "@/features/saltong/config";
import { SUDOKU_CONFIG } from "@/features/sudoku/config";

export const GAME_GUIDES = [
  {
    slug: "saltong",
    path: "/how-to-play/saltong",
    name: "Saltong Classic",
    navTitle: "Saltong",
    navSubtitle: "Classic",
    icon: SALTONG_CONFIG.modes.classic.icon,
    colorScheme: SALTONG_CONFIG.modes.classic.colorScheme,
    playPath: "/play",
    vaultPath: "/play/vault",
  },
  {
    slug: "mini",
    path: "/how-to-play/mini",
    name: "Saltong Mini",
    navTitle: "Saltong",
    navSubtitle: "Mini",
    icon: SALTONG_CONFIG.modes.mini.icon,
    colorScheme: SALTONG_CONFIG.modes.mini.colorScheme,
    playPath: "/play/mini",
    vaultPath: "/play/mini/vault",
  },
  {
    slug: "max",
    path: "/how-to-play/max",
    name: "Saltong Max",
    navTitle: "Saltong",
    navSubtitle: "Max",
    icon: SALTONG_CONFIG.modes.max.icon,
    colorScheme: SALTONG_CONFIG.modes.max.colorScheme,
    playPath: "/play/max",
    vaultPath: "/play/max/vault",
  },
  {
    slug: "hex",
    path: "/how-to-play/hex",
    name: "Saltong Hex",
    navTitle: "Saltong",
    navSubtitle: "Hex",
    icon: HEX_CONFIG.icon,
    colorScheme: HEX_CONFIG.colorScheme,
    playPath: "/play/hex",
    vaultPath: "/play/hex/vault",
  },
  {
    slug: "sudoku",
    path: "/how-to-play/sudoku",
    name: SUDOKU_CONFIG.displayName,
    navTitle: SUDOKU_CONFIG.displayName,
    navSubtitle: "",
    icon: SUDOKU_CONFIG.icon,
    colorScheme: SUDOKU_CONFIG.colorScheme,
    playPath: "/play/sudoku",
    vaultPath: SUDOKU_CONFIG.vaultPath,
  },
  {
    slug: "mathinik",
    path: "/how-to-play/mathinik",
    name: MATHINIK_CONFIG.displayName,
    navTitle: MATHINIK_CONFIG.displayName,
    navSubtitle: "",
    icon: MATHINIK_CONFIG.icon,
    colorScheme: MATHINIK_CONFIG.colorScheme,
    playPath: MATHINIK_CONFIG.path,
    vaultPath: MATHINIK_CONFIG.vaultPath,
  },
] as const;

export type GameGuide = (typeof GAME_GUIDES)[number];
export type GameGuideSlug = GameGuide["slug"];

export function getGameGuide(slug: string) {
  return GAME_GUIDES.find((guide) => guide.slug === slug);
}
