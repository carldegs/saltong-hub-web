"use client";

import { getDailyGameCountdown } from "@/utils/time";
import GameCard from "./game-card";

const DAILY_GAMES = [
  {
    href: "/play",
    icon: "/main.svg",
    name: "Saltong",
    className: "hover:bg-saltong-green-200 dark:hover:bg-saltong-green-500",
  },
  {
    href: "/play/max",
    icon: "/max.svg",
    name: "Max",
    className: "hover:bg-saltong-red-200 dark:hover:bg-saltong-red-500",
  },
  {
    href: "/play/mini",
    icon: "/mini.svg",
    name: "Mini",
    className: "hover:bg-saltong-blue-200 dark:hover:bg-saltong-blue-500",
  },
];

export default function DailyGamesCard({ className }: { className?: string }) {
  return (
    <GameCard
      games={DAILY_GAMES}
      countdown={getDailyGameCountdown}
      className={className}
    />
  );
}
