import { useLocalStorage } from "usehooks-ts";
import { PlayerStats } from "../types";
import { GameId } from "../../types";

export default function usePlayerStats() {
  return useLocalStorage<Partial<Record<GameId, PlayerStats>>>(
    "saltong/stats",
    {},
    {
      initializeWithValue: false,
    }
  );
}
