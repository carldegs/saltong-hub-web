import { HexLookupTableItem } from "../types";

export async function getHexLookupTable(): Promise<HexLookupTableItem[]> {
  const response = await fetch("/api/admin/hex/lookup", {
    method: "GET",
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(
      error.details || error.error || "Failed to get hex lookup table"
    );
  }

  const data = await response.json();
  return data.lookupTable;
}

export interface LookupTableMetadata {
  status: "generating" | "completed" | "error" | "not_found";
  startedAt?: string;
  completedAt?: string;
  lastUpdatedAt?: string;
  error?: string;
  recordCount?: number;
  message?: string;
}

export async function fetchLookupTableMetadata(): Promise<LookupTableMetadata> {
  const response = await fetch("/api/admin/hex/lookup/status");

  if (response.status === 404) {
    const data = await response.json();
    return { status: "not_found", message: data.message };
  }

  if (!response.ok) {
    throw new Error("Failed to fetch metadata");
  }

  return response.json();
}

export async function triggerLookupTableRegeneration(): Promise<void> {
  const response = await fetch("/api/admin/hex/lookup", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(
      error.details || error.error || "Failed to trigger regeneration"
    );
  }
}
