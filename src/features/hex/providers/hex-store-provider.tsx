"use client";

import { createContext, ReactNode, useRef } from "react";

import {
  createHexStore,
  defaultInitState,
  HexState,
} from "../stores/hex-store";

export type HexStoreApi = ReturnType<typeof createHexStore>;

export const HexStoreContext = createContext<HexStoreApi | null>(null);

export interface HexStoreProviderProps {
  children: ReactNode;
  initialState?: Partial<HexState>;
}

export const HexStoreProvider = ({
  children,
  initialState = {},
}: HexStoreProviderProps) => {
  const storeRef = useRef<HexStoreApi | null>(null);

  if (storeRef.current === null) {
    storeRef.current = createHexStore({
      ...defaultInitState,
      ...initialState,
    });
  }

  return (
    // eslint-disable-next-line react-hooks/refs
    <HexStoreContext.Provider value={storeRef.current}>
      {children}
    </HexStoreContext.Provider>
  );
};
