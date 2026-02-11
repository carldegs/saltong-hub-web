import { createStore } from "zustand/vanilla";

export type ModalState = {
  isOpen: boolean;
  openModal: string | null;
};

export type ModalActions = {
  onOpenChange(_isOpen: boolean): void;
  setOpenModal(modalName: string | null): void;
};

export type ModalStore = ModalState & ModalActions;

export const defaultInitState: ModalState = {
  isOpen: false,
  openModal: null,
};

export const createModalStore = (initState: ModalState = defaultInitState) => {
  return createStore<ModalStore>()((set) => ({
    ...initState,
    onOpenChange: (isOpen) => set({ isOpen }),
    setOpenModal: (modalName) => set({ openModal: modalName }),
  }));
};
