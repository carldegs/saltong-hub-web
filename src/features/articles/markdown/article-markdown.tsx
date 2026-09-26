import ReactMarkdown, { type Components } from "react-markdown";
import rehypeSanitize, { defaultSchema } from "rehype-sanitize";
import remarkDirective from "remark-directive";
import remarkGfm from "remark-gfm";
import { visit } from "unist-util-visit";

import { ARTICLE_GAME_IDS } from "../schema";
import { parsePlayGamesDirective } from "./directives";
import { PlayGames } from "./play-games";

type DirectiveNode = {
  type: string;
  name?: string;
  attributes?: Record<string, string | undefined>;
  data?: {
    hName?: string;
    hProperties?: Record<string, string>;
  };
};

function isDirectiveNode(node: unknown): node is DirectiveNode {
  return typeof node === "object" && node !== null && "type" in node;
}

function remarkPlayGamesDirective() {
  return (tree: Parameters<typeof visit>[0]) => {
    visit(tree, "containerDirective", (node) => {
      if (!isDirectiveNode(node)) return;

      const games = parsePlayGamesDirective(
        node.name ?? "",
        node.attributes ?? {}
      );
      if (!games) return;

      node.data = {
        hName: "play-games",
        hProperties: { games: games.join(" ") },
      };
    });
  };
}

const sanitizeSchema = {
  ...defaultSchema,
  tagNames: [...(defaultSchema.tagNames ?? []), "play-games"],
  attributes: {
    ...defaultSchema.attributes,
    "play-games": ["games"],
  },
};

const markdownComponents = {
  "play-games": ({ games }) => {
    const requestedGames =
      typeof games === "string" ? games.split(/\s+/).filter(Boolean) : [];
    const validGames = requestedGames.filter((game) =>
      ARTICLE_GAME_IDS.includes(game as (typeof ARTICLE_GAME_IDS)[number])
    ) as (typeof ARTICLE_GAME_IDS)[number][];

    return validGames.length > 0 ? <PlayGames games={validGames} /> : null;
  },
} as Components;

export function ArticleMarkdown({ content }: { content: string }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm, remarkDirective, remarkPlayGamesDirective]}
      rehypePlugins={[[rehypeSanitize, sanitizeSchema]]}
      components={markdownComponents}
      skipHtml
    >
      {content}
    </ReactMarkdown>
  );
}
