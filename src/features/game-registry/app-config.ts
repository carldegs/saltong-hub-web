import { BaseConfig } from "./types";
import { SALTONG_CONFIG } from "../saltong/config";
import { HEX_CONFIG } from "../hex/config";
import { SUDOKU_CONFIG } from "../sudoku/config";
import { MATHINIK_CONFIG } from "../mathinik/config";

export type FeaturedGame = Pick<
  BaseConfig,
  "displayName" | "icon" | "colorScheme" | "path" | "blurb"
> & {
  id: string;
};

export const RESULTS_DIALOG_FEATURED_GAME_LIST = [
  ...Object.values(SALTONG_CONFIG.modes).map(
    ({ displayName, icon, colorScheme, path, mode, blurb }) => ({
      id: mode,
      displayName,
      icon,
      colorScheme,
      path: `/play${path}`,
      blurb,
    })
  ),
  {
    displayName: HEX_CONFIG.displayName,
    icon: HEX_CONFIG.icon,
    colorScheme: HEX_CONFIG.colorScheme,
    path: `/play${HEX_CONFIG.path}`,
    blurb: HEX_CONFIG.blurb,
    id: "hex",
  },
  {
    displayName: SUDOKU_CONFIG.displayName,
    icon: SUDOKU_CONFIG.icon,
    colorScheme: SUDOKU_CONFIG.colorScheme,
    path: `/play${SUDOKU_CONFIG.path}`,
    blurb: SUDOKU_CONFIG.blurb,
    id: "sudoku",
  },
  {
    displayName: MATHINIK_CONFIG.displayName,
    icon: MATHINIK_CONFIG.icon,
    colorScheme: MATHINIK_CONFIG.colorScheme,
    path: MATHINIK_CONFIG.path,
    blurb: MATHINIK_CONFIG.blurb,
    id: "mathinik",
  },
] satisfies FeaturedGame[];
