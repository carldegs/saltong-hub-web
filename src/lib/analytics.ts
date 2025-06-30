import { sendGAEvent } from "@next/third-parties/google";
import { useCallback } from "react";

// Common analytics params you might want to use
export type AnalyticsParams = {
  userId?: string;
  sessionId?: string;
  value?: number;
  [key: string]: unknown;
};

export function sendEvent(action: string, params: AnalyticsParams = {}) {
  const path = typeof window !== "undefined" ? window.location.pathname : "";

  if (process.env.NODE_ENV === "development") {
    console.log("Analytics Event:", action, { ...params, path });
  }

  sendGAEvent("event", action, {
    ...params,
    path,
  });
}

export function useAnalytics() {
  return useCallback(sendEvent, []);
}
