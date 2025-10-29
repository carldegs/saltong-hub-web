import { BaseConfig } from "./types";
import { SALTONG_CONFIG } from "../saltong/config";
import { HEX_CONFIG } from "../hex/config";

export type FeaturedGame = Pick<
  BaseConfig,
  "displayName" | "icon" | "colorScheme" | "path"
> & {
  id: string;
};

export const RESULTS_DIALOG_FEATURED_GAME_LIST = [
  ...Object.values(SALTONG_CONFIG.modes).map(
    ({ displayName, icon, colorScheme, path, mode }) => ({
      id: mode,
      displayName,
      icon,
      colorScheme,
      path,
    })
  ),
  {
    displayName: HEX_CONFIG.displayName,
    icon: HEX_CONFIG.icon,
    colorScheme: HEX_CONFIG.colorScheme,
    path: HEX_CONFIG.path,
    id: "hex",
  },
] satisfies FeaturedGame[];
