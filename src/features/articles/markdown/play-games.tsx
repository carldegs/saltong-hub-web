import Link from "next/link";

import type { ARTICLE_GAME_IDS } from "../schema";

const gameLinks = {
  classic: { href: "/play", label: "Saltong Classic" },
  mini: { href: "/play/mini", label: "Saltong Mini" },
  max: { href: "/play/max", label: "Saltong Max" },
  hex: { href: "/play/hex", label: "Saltong Hex" },
} satisfies Record<
  (typeof ARTICLE_GAME_IDS)[number],
  { href: string; label: string }
>;

export function PlayGames({ games }: { games: (keyof typeof gameLinks)[] }) {
  return (
    <div className="not-prose my-8 grid gap-3 sm:grid-cols-3">
      {games.map((game) => (
        <Link
          key={game}
          href={gameLinks[game].href}
          className="border-primary/20 bg-primary/5 hover:bg-primary/10 rounded-xl border p-4 font-semibold no-underline transition-colors"
        >
          {gameLinks[game].label}
        </Link>
      ))}
    </div>
  );
}
