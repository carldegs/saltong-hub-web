"use client";

import { useQuery } from "@tanstack/react-query";

import { AdminUserStatsResponse } from "../types";

async function fetchAdminUserStats(email: string) {
  const response = await fetch("/api/admin/transfer/user-stats", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email }),
  });

  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(payload.error ?? "Unable to fetch user stats");
  }

  return payload as AdminUserStatsResponse;
}

export function useAdminUserStats(email: string) {
  const normalizedEmail = email.trim().toLowerCase();

  return useQuery<AdminUserStatsResponse, Error>({
    queryKey: ["admin-user-stats", normalizedEmail],
    queryFn: () => fetchAdminUserStats(normalizedEmail),
    enabled: normalizedEmail.length > 3,
    retry: false,
  });
}
