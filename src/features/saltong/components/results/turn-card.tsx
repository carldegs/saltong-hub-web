"use client";

import { DigitalClock } from "@/components/ui/digital-clock";
import { HighlightCardWrapper } from "./highlight-card-wrapper";
import { useMemo } from "react";
import type { SaltongUserRound, SaltongUserStats } from "../../types";

export function TurnCard({
  solvedTurn,
  winTurns,
  theme = "green",
}: {
  solvedTurn?: SaltongUserRound["solvedTurn"];
  winTurns?: SaltongUserStats["winTurns"];
  theme?: "green" | "red" | "blue" | "purple";
}) {
  const { clockColor, clockOff } = useMemo(() => {
    switch (theme) {
      case "red":
        return { clockColor: "#FF6B6B", clockOff: "#FF6B6B22" };
      case "blue":
        return { clockColor: "#4EC1FF", clockOff: "#4EC1FF22" };
      case "purple":
        return { clockColor: "#C084FC", clockOff: "#C084FC22" };
      default:
        return { clockColor: "#31FF98", clockOff: "#31FF9822" };
    }
  }, [theme]);

  const avgTurns = useMemo(() => {
    const counts = (winTurns ?? [])
      .map((value) => Number(value))
      .map((value) => (Number.isFinite(value) ? value : 0));

    const totalWins = counts.reduce((sum, count) => sum + count, 0);
    if (!totalWins) return null;

    const weighted = counts.reduce(
      (sum, count, index) => sum + (index + 1) * count,
      0
    );

    return weighted / totalWins;
  }, [winTurns]);

  const turnsDisplay = solvedTurn ? String(solvedTurn) : "FAIL";
  const avgTurnsDisplay = avgTurns ? avgTurns.toFixed(1) : "—";

  return (
    <HighlightCardWrapper
      theme={theme}
      className="flex aspect-square w-full justify-end"
    >
      <DigitalClock
        className="mt-1"
        value={turnsDisplay}
        scale={0.35}
        color={clockColor}
        offColor={clockOff}
      />
      <p
        className="mt-2 font-bold tracking-widest"
        style={{ color: clockColor }}
      >
        TURNS
      </p>
    </HighlightCardWrapper>
  );
}
