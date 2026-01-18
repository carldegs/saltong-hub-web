"use client";

import { formatShortDuration } from "@/utils/time";
import { Duration } from "date-fns";
import { useMemo, useState } from "react";
import { useInterval } from "usehooks-ts";

interface CountdownTimerProps {
  countdown: () => Duration;
}

export function CountdownTimer({ countdown }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState(() => countdown());

  useInterval(() => {
    setTimeLeft(countdown());
  }, 1000);

  const formatted = useMemo(() => formatShortDuration(timeLeft), [timeLeft]);

  return (
    <span>
      Ends in <b suppressHydrationWarning>{formatted}</b>
    </span>
  );
}
