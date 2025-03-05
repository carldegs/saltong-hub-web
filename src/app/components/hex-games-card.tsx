"use client";

import { getHexGameCountdown } from "@/utils/time";
import GameCountdownCard from "./game-countdown-card";

const HEX_GAMES = [
  {
    href: "/play/hex",
    icon: "/hex.svg",
    name: "Hex",
    className: "hover:bg-saltong-purple-200 dark:hover:bg-saltong-purple-500",
  },
];

export default function HexGamesCard({ className }: { className?: string }) {
  return (
    <GameCountdownCard
      games={HEX_GAMES}
      countdown={getHexGameCountdown}
      className={className}
    />
  );
}
