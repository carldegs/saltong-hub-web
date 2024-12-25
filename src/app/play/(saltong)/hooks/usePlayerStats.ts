import { useLocalStorage } from "usehooks-ts";
import { GameMode, PlayerStats } from "../types";

export default function usePlayerStats() {
  return useLocalStorage<Partial<Record<GameMode, PlayerStats>>>(
    "saltong/stats",
    {},
    {
      initializeWithValue: false,
    }
  );
}
