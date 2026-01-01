import { SALTONG_MODES } from "@/features/saltong/constants";
import { SaltongMode } from "@/features/saltong/types";

import { LegacyModeStatsSnapshot, LegacySavePayload } from "../types";

export const LEGACY_SECRET_KEY = "mama-mo-saltong";

function xorCipher(text: string, key: string) {
  let result = "";
  for (let i = 0; i < text.length; i += 1) {
    const code = text.charCodeAt(i) ^ key.charCodeAt(i % key.length);
    result += String.fromCharCode(code);
  }
  return result;
}

function decodeBase64(value: string) {
  if (typeof atob !== "function") {
    throw new Error("Base64 decoding is not supported in this environment");
  }

  return atob(value);
}

function parseModeSegment(segment: string): LegacyModeStatsSnapshot | null {
  if (!segment) {
    return null;
  }

  const parts = segment.split("|");
  const [gamesPlayed, totalWins, currentStreak, longestStreak, lastWinDateMs] =
    parts;
  const winTurnsCsv = parts[5] ?? "";

  const hasContent = parts.some((part) => part && part.trim() !== "");
  if (!hasContent) {
    return null;
  }

  const winTurns = winTurnsCsv
    .split(",")
    .map((turn) => turn.trim())
    .filter((turn) => turn.length > 0)
    .map((turn) => Number(turn))
    .filter((turn) => Number.isFinite(turn));

  return {
    gamesPlayed: Number(gamesPlayed) || 0,
    totalWins: Number(totalWins) || 0,
    currentWinStreak: Number(currentStreak) || 0,
    longestWinStreak: Number(longestStreak) || 0,
    lastWinDate: lastWinDateMs
      ? new Date(Number(lastWinDateMs)).toISOString()
      : null,
    winTurns,
  };
}

export function parseLegacySave(rawContent: string): LegacySavePayload {
  const normalized = rawContent.replace(/\s+/g, "");
  if (!normalized) {
    throw new Error("The uploaded file is empty.");
  }

  const binaryPayload = decodeBase64(normalized);
  const decodedString = xorCipher(binaryPayload, LEGACY_SECRET_KEY);
  const segments = decodedString.split(";");

  if (segments.length < SALTONG_MODES.length) {
    throw new Error("Legacy payload is incomplete.");
  }

  const modes = SALTONG_MODES.reduce<
    Record<SaltongMode, LegacyModeStatsSnapshot | null>
  >(
    (acc, mode, index) => {
      acc[mode] = parseModeSegment(segments[index] ?? "");
      return acc;
    },
    {} as Record<SaltongMode, LegacyModeStatsSnapshot | null>
  );

  return {
    modes,
    decodedString,
  };
}
