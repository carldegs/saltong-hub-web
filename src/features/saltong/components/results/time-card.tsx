"use client";

import { DigitalClock } from "@/components/ui/digital-clock";
import { HighlightCardWrapper } from "./highlight-card-wrapper";
import { differenceInSeconds } from "date-fns";
import { useEffect, useMemo, useState } from "react";

export function TimeCard({
  startTime,
  endTime,
  theme = "green",
}: {
  startTime: string;
  endTime: string;
  theme?: "green" | "red" | "blue" | "purple";
}) {
  const start = new Date(startTime);
  const end = new Date(endTime);
  const targetSeconds = Math.max(0, differenceInSeconds(end, start));
  const targetDays = Math.floor(targetSeconds / 86400);
  const targetHours = Math.floor((targetSeconds % 86400) / 3600);
  const [displaySeconds, setDisplaySeconds] = useState(0);

  useEffect(() => {
    let rafId: number | null = null;

    if (targetSeconds <= 0) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setDisplaySeconds(0);
      return;
    }

    const durationMs = Math.min(750, Math.max(800, targetSeconds * 15));
    const delayMs = 250;
    const startMs = performance.now() + delayMs;

    const tick = (now: number) => {
      if (now < startMs) {
        rafId = requestAnimationFrame(tick);
        return;
      }

      const progress = Math.min((now - startMs) / durationMs, 1);
      const nextValue = Math.floor(progress * targetSeconds);
      setDisplaySeconds((prev) => (prev === nextValue ? prev : nextValue));

      if (progress < 1) {
        rafId = requestAnimationFrame(tick);
      }
    };

    rafId = requestAnimationFrame(tick);

    return () => {
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
      }
    };
  }, [targetSeconds]);

  const displayDuration = useMemo(() => {
    const days = Math.floor(displaySeconds / 86400);
    const hours = Math.floor((displaySeconds % 86400) / 3600);
    const minutes = Math.floor((displaySeconds % 3600) / 60);
    const seconds = displaySeconds % 60;

    return { days, hours, minutes, seconds };
  }, [displaySeconds]);

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

  return (
    <HighlightCardWrapper theme={theme} className="w-full">
      <DigitalClock
        scale={targetDays ? 0.25 : 0.35}
        value={displayDuration}
        showDays={targetDays > 0}
        showHours={targetDays > 0 || targetHours > 0}
        className="mt-3"
        color={clockColor}
        offColor={clockOff}
      />
      <p
        className="mt-2 font-bold tracking-widest"
        style={{ color: clockColor }}
      >
        TIME SOLVED
      </p>
    </HighlightCardWrapper>
  );
}
