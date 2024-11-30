import { useContext } from "react";
import { HexStoreContext } from "../providers/hex-store-provider";
import { useStore } from "zustand";
import { HexStore } from "../stores/hex-store";

export default function useHexStore<T>(selector: (store: HexStore) => T): T {
  const context = useContext(HexStoreContext);

  if (!context) {
    throw new Error("useHexStore must be used within a HexStoreProvider");
  }

  return useStore(context, selector);
}
