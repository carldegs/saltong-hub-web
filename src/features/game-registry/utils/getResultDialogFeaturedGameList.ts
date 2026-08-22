import { RESULTS_DIALOG_FEATURED_GAME_LIST } from "../app-config";

const NEW_GAME_IDS = new Set(["sudoku", "mathinik"]);

export const getResultDialogFeaturedGameList = (id: string) => {
  const games = RESULTS_DIALOG_FEATURED_GAME_LIST.map((game) => {
    if (game.id === id) {
      return {
        ...game,
        id: "vault",
        href: `${game.path}/vault`,
        isNew: false,
      };
    }

    return {
      ...game,
      href: game.path,
      isNew: NEW_GAME_IDS.has(game.id),
    };
  });

  return [
    ...games.filter((game) => game.id === "vault"),
    ...games.filter((game) => game.id !== "vault" && game.isNew),
    ...games.filter((game) => game.id !== "vault" && !game.isNew),
  ];
};
