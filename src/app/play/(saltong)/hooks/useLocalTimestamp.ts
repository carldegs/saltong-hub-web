import { useLocalStorage } from "usehooks-ts";

export default function useLocalTimestamp() {
  return useLocalStorage<number>("saltong/lastUpdated", 0, {
    initializeWithValue: false,
  });
}
