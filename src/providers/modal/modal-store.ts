import { createStore } from "zustand/vanilla";

export type ModalState = {
  isOpen: boolean;
};

export type ModalActions = {
  onOpenChange(_isOpen: boolean): void;
};

export type ModalStore = ModalState & ModalActions;

export const defaultInitState: ModalState = {
  isOpen: false,
};

export const createModalStore = (initState: ModalState = defaultInitState) => {
  return createStore<ModalStore>()((set) => ({
    ...initState,
    onOpenChange: (isOpen) => set({ isOpen }),
  }));
};
