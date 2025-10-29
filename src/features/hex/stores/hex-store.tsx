import { createStore } from "zustand";

export type HexState = {
  inputWord: string;
  letters: string[];
};

export type HexActions = {
  setLetters: (letters: string[]) => void;
  setInputWord: (inputWord: string | ((inputWord: string) => string)) => void;
  deleteInputWordLetter: () => void;
  shuffleLetters: () => void;
  clearInput: () => void;
};

export type HexStore = HexState & HexActions;

export const defaultInitState: HexState = {
  inputWord: "",
  letters: [],
};

export const createHexStore = (initState: HexState = defaultInitState) => {
  return createStore<HexStore>((set) => ({
    ...initState,
    setLetters: (letters) => set({ letters }),
    setInputWord: (inputWord) => {
      set((state) => {
        if (typeof inputWord === "string") {
          return {
            inputWord,
          };
        } else {
          return {
            inputWord: inputWord(state.inputWord),
          };
        }
      });
    },
    shuffleLetters: () =>
      set((state) => {
        return {
          letters: [...state.letters].sort(() => Math.random() - 0.5),
        };
      }),
    clearInput: () => set({ inputWord: "" }),
    deleteInputWordLetter: () =>
      set((state) => {
        return {
          inputWord: state.inputWord.slice(0, -1),
        };
      }),
  }));
};
