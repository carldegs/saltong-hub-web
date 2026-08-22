import { BaseGameRegistry, BaseConfig } from "../game-registry/types";

export const MATHINIK_CONFIG = {
  id: "mathinik",
  displayName: "Mathinik",
  path: "/play/mathinik",
  vaultPath: "/play/mathinik/vault",
  icon: "/mathinik.svg",
  blurb: "Combine six random numbers using basic math to hit a target.",
  colorScheme: "teal",
  startDate: "2026-08-22",
} as const satisfies BaseGameRegistry &
  BaseConfig & {
    vaultPath: string;
    startDate: string;
  };
