"use client";

import { DigitalClock } from "@/components/ui/digital-clock";
import { HighlightCardWrapper } from "./highlight-card-wrapper";
import { useMemo } from "react";
import type { SaltongUserRound } from "../../types";

export function TurnCard({
  solvedTurn,
  theme = "green",
}: {
  solvedTurn?: SaltongUserRound["solvedTurn"];
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

  const turnsDisplay = solvedTurn ? String(solvedTurn) : "FAIL";

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
