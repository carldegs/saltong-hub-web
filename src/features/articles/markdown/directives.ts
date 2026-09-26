import { ARTICLE_GAME_IDS } from "../schema";

type DirectiveAttributes = Record<string, string | undefined>;

export function parsePlayGamesDirective(
  name: string,
  attributes: DirectiveAttributes
) {
  if (
    name !== "play-games" ||
    Object.keys(attributes).length !== 1 ||
    !attributes.games
  ) {
    return null;
  }

  const games = attributes.games.split(/\s+/).filter(Boolean);
  if (
    games.length === 0 ||
    games.some(
      (game) =>
        !ARTICLE_GAME_IDS.includes(game as (typeof ARTICLE_GAME_IDS)[number])
    )
  ) {
    return null;
  }

  return [...new Set(games)] as (typeof ARTICLE_GAME_IDS)[number][];
}
