"use client";

import { useMutation } from "@tanstack/react-query";

import { AdminUpsertStatsRequest, AdminUpsertStatsResponse } from "../types";

async function upsertAdminUserStats(payload: AdminUpsertStatsRequest) {
  const response = await fetch("/api/admin/transfer/user-stats", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const payloadJson = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(payloadJson.error ?? "Failed to update user stats");
  }

  return payloadJson as AdminUpsertStatsResponse;
}

export function useAdminUpsertUserStats() {
  return useMutation<AdminUpsertStatsResponse, Error, AdminUpsertStatsRequest>({
    mutationFn: upsertAdminUserStats,
  });
}
