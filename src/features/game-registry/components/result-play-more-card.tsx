import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";
import { Button } from "@/components/ui/button";
import { PlayIcon, VaultIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { ReactNode } from "react";
import { getResultDialogFeaturedGameList } from "../utils/getResultDialogFeaturedGameList";
import { sendEvent } from "@/lib/analytics";
import NewFeatureBadge from "@/components/shared/new-feature-badge";

type FeaturedItem = {
  id: string;
  href: string;
  icon: string;
  title: string;
  description: string;
  isVault?: boolean;
  isNew: boolean;
};

export default function ResultPlayMoreCard({
  currentGameId,
  currentMode,
  leadingItems = [],
}: {
  currentGameId: string;
  currentMode?: string;
  leadingItems?: ReactNode[];
}) {
  const gameList: FeaturedItem[] = getResultDialogFeaturedGameList(
    currentGameId
  ).map((game) => ({
    id: game.id,
    href: game.href,
    icon: game.icon,
    title: game.id === "vault" ? `${game.displayName} Vault` : game.displayName,
    description:
      game.id === "vault"
        ? `Play previous rounds of ${game.displayName}`
        : game.blurb,
    isVault: game.id === "vault",
    isNew: game.isNew,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Play More Games</CardTitle>
      </CardHeader>
      <CardDescription>
        <div className="mx-4 space-y-2">
          {leadingItems.map((item, index) => (
            <div key={index}>{item}</div>
          ))}
          {gameList.map((game) => (
            <Item
              variant="muted"
              key={`${game.id}-${game.href}`}
              className="rounded-lg"
            >
              <ItemMedia className={game.isVault ? "relative" : undefined}>
                <Image
                  src={game.icon}
                  alt={game.title}
                  width={42}
                  height={42}
                />
                {game.isVault && (
                  <VaultIcon className="text-primary bg-muted absolute -right-2 -bottom-2 rounded-md" />
                )}
              </ItemMedia>
              <ItemContent>
                <ItemTitle className="text-primary flex items-center">
                  {game.title}
                  {game.isNew && <NewFeatureBadge className="ml-1" />}
                </ItemTitle>
                <ItemDescription className="m-0 -mt-0.5">
                  {game.description}
                </ItemDescription>
              </ItemContent>
              <ItemActions>
                <Button size="sm" asChild className="font-bold">
                  <Link
                    href={game.href}
                    prefetch={false}
                    onClick={() => {
                      sendEvent("button_click", {
                        location: "results_dialog",
                        action: game.isVault ? "play_vault" : "play_game",
                        currentGameId,
                        currentMode,
                        targetGameId: game.id,
                      });
                    }}
                  >
                    <PlayIcon />
                    PLAY
                  </Link>
                </Button>
              </ItemActions>
            </Item>
          ))}
        </div>
      </CardDescription>
    </Card>
  );
}
