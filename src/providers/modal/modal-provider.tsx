"use client";

import { ReactNode, createContext, useContext, useRef } from "react";
import { ModalStore, createModalStore } from "./modal-store";
import { useStore } from "zustand";

export type ModalStoreApi = ReturnType<typeof createModalStore>;

export const ModalStoreContext = createContext<ModalStoreApi | undefined>(
  undefined
);

export default function ModalStoreProvider({
  children,
}: {
  children: ReactNode;
}) {
  const storeRef = useRef<ModalStoreApi>(undefined);

  if (!storeRef.current) {
    storeRef.current = createModalStore();
  }

  return (
    <ModalStoreContext.Provider value={storeRef.current}>
      {children}
    </ModalStoreContext.Provider>
  );
}

export const useModalStore = <T,>(selector: (_store: ModalStore) => T): T => {
  const context = useContext(ModalStoreContext);

  if (!context) {
    throw new Error("useModalStore must be used within a ModalStoreProvider");
  }

  return useStore(context, selector);
};
