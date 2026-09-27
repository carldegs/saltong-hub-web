import { Node } from "@tiptap/core";

import { ARTICLE_GAME_IDS } from "../schema";
import { parsePlayGamesDirective } from "../markdown/directives";

const directivePattern = /:::play-games\{games="([^"]*)"\}/g;

export function prepareArticleMarkdown(markdown: string) {
  return markdown.replace(directivePattern, (_match, games: string) => {
    const parsedGames = parsePlayGamesDirective("play-games", { games });
    if (!parsedGames) {
      throw new Error("Choose at least one valid game");
    }

    return `<play-games games="${parsedGames.join(" ")}"></play-games>`;
  });
}

export const PlayGamesNode = Node.create({
  name: "playGames",
  group: "block",
  atom: true,

  addAttributes() {
    return {
      games: {
        default: "classic",
      },
    };
  },

  parseHTML() {
    return [{ tag: "play-games" }];
  },

  renderHTML({ HTMLAttributes }) {
    return ["play-games", HTMLAttributes];
  },

  renderMarkdown(node) {
    const games = String(node.attrs?.games ?? "")
      .split(/\s+/)
      .filter((game) =>
        ARTICLE_GAME_IDS.includes(game as (typeof ARTICLE_GAME_IDS)[number])
      );

    return games.length > 0
      ? `:::play-games{games="${[...new Set(games)].join(" ")}"}`
      : "";
  },
});
