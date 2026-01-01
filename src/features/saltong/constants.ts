import { SaltongMode } from "./types";

export const ADMIN_CONSTANTS = {
  MAX_ROUNDS_PER_GENERATION: 365,
  MAX_PICK_ATTEMPTS: 500,
  CANDIDATE_MULTIPLIER: 2,
  MAX_RECENT_ROUNDS: 365,
} as const;

export const SALTONG_MODES: SaltongMode[] = ["classic", "max", "mini"];
