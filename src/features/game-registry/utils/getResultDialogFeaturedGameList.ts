import { RESULTS_DIALOG_FEATURED_GAME_LIST } from "../app-config";

export const getResultDialogFeaturedGameList = (id: string) => {
  return RESULTS_DIALOG_FEATURED_GAME_LIST.map((game) => {
    if (game.id === id) {
      return {
        ...game,
        id: "vault",
        href: `/play${game.path}/vault`,
      };
    }

    return {
      ...game,
      href: `/play${game.path}`,
    };
  });
};
