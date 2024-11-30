"use client";

import { createContext, ReactNode, useRef } from "react";
import {
  createHexStore,
  defaultInitState,
  HexState,
} from "../stores/hex-store";

export type HexStoreApi = ReturnType<typeof createHexStore>;

export const HexStoreContext = createContext<HexStoreApi | undefined>(
  undefined
);

export interface HexStoreProviderProps {
  children: ReactNode;
  initialState?: Partial<HexState>;
}

export const HexStoreProvider = ({
  children,
  initialState = {},
}: HexStoreProviderProps) => {
  const storeRef = useRef<HexStoreApi>();

  if (!storeRef.current) {
    storeRef.current = createHexStore({
      ...defaultInitState,
      ...initialState,
    });
  }

  return (
    <HexStoreContext.Provider value={storeRef.current}>
      {children}
    </HexStoreContext.Provider>
  );
};
