import { BaseGameRegistry, BaseConfig } from "../game-registry/types";

export const MATHINIK_CONFIG = {
  id: "mathinik",
  displayName: "Mathinik",
  path: "/play/mathinik",
  vaultPath: "/play/mathinik/vault",
  icon: "/mathinik.svg",
  blurb: "Combine six random numbers using basic arithmetic to hit a target.",
  colorScheme: "teal",
  startDate: "2026-06-19",
} as const satisfies BaseGameRegistry &
  BaseConfig & {
    vaultPath: string;
    startDate: string;
  };
