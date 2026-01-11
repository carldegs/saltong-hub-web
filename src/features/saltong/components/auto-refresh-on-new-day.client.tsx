"use client";

import { useEffect } from "react";
import { getFormattedDateInPh } from "@/utils/time";

/**
 * Refreshes the page when the current PH date no longer matches
 * the loaded game date, provided there is no `d` override in the URL.
 */
export default function AutoRefreshOnNewDay({
  gameDate,
  pollIntervalMs = 60000,
}: {
  gameDate: string;
  pollIntervalMs?: number;
}) {
  useEffect(() => {
    const checkAndRefresh = () => {
      const params = new URLSearchParams(window.location.search);
      const hasOverride = params.has("d");
      if (hasOverride) return;

      const currentPhDate = getFormattedDateInPh();

      if (currentPhDate !== gameDate) {
        window.location.reload();
      }
    };

    // Immediate check on mount
    checkAndRefresh();

    // Poll periodically to catch date change without timers
    const id = window.setInterval(checkAndRefresh, pollIntervalMs);
    return () => {
      window.clearInterval(id);
    };
  }, [gameDate, pollIntervalMs]);

  return null;
}
