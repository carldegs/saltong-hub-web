import { GameSettings } from "./types";

export const getTitleSubtitle = (name: GameSettings["name"]) => {
  const [title, subtitle] = name?.split(" ") ?? [];

  return { title, subtitle };
};
