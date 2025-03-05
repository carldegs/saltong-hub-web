import { GameConfig } from "../(saltong)/types";

export const HEX_RANKS = [
  { name: "bagito", percentage: 0, icon: "👶" },
  { name: "sakto", percentage: 0.02, icon: "🌱" },
  { name: "umuusad", percentage: 0.05, icon: "🚶" },
  { name: "marunong", percentage: 0.07, icon: "🎯" },
  { name: "magaling", percentage: 0.15, icon: "💪" },
  { name: "mahusay", percentage: 0.25, icon: "🌟" },
  { name: "matinik", percentage: 0.35, icon: "🦅" },
  { name: "bihasa", percentage: 0.5, icon: "🎓" },
  { name: "alamat", percentage: 0.7, icon: "👑" },
  { name: "bathala", percentage: 0.9, icon: "⚡" },
] as const;

export const HEX_CONFIG = {
  icon: "/hex.svg",
  subtitle: "Hex",
  blurb:
    "Form words using the given letters, but don’t forget—the center letter is key!",
  colorScheme: "purple",
  mode: "hex",
  startDate: "2022-01-21",
} satisfies Pick<
  GameConfig,
  "icon" | "subtitle" | "blurb" | "colorScheme" | "startDate"
> & { mode: "hex" };
