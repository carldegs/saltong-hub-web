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
import { SaltongMode } from "../../types";
import { SALTONG_CONFIG } from "../../config";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { PlayIcon, VaultIcon } from "lucide-react";
import Link from "next/link";
import { HEX_CONFIG } from "@/features/hex/config";

const GAMES = [
  ...Object.values(SALTONG_CONFIG.modes),
  {
    ...HEX_CONFIG,
    mode: "hex",
  },
];

export default function PlayMoreCard({ mode }: { mode: SaltongMode }) {
  const currentModeConfig = SALTONG_CONFIG.modes[mode];
  const gameList = GAMES.filter((game) => game.mode !== mode);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Play More Games</CardTitle>
      </CardHeader>
      <CardDescription>
        <div className="mx-4 space-y-2">
          <Item variant="muted" className="rounded-lg">
            <ItemMedia className="relative">
              <Image
                src={currentModeConfig.icon}
                alt={currentModeConfig.displayName}
                width={42}
                height={42}
              />
              <VaultIcon className="text-primary bg-muted absolute -right-2 -bottom-2 rounded-md" />
            </ItemMedia>
            <ItemContent>
              <ItemTitle className="text-primary">
                {currentModeConfig.displayName} Vault
              </ItemTitle>
              <ItemDescription className="m-0">
                Play previous rounds of {currentModeConfig.displayName}
              </ItemDescription>
            </ItemContent>
            <ItemActions>
              <Button size="sm" asChild className="font-bold">
                <Link
                  href={`/play${mode === "classic" ? "" : `/${mode}`}/vault`}
                  prefetch={false}
                >
                  <PlayIcon />
                  PLAY
                </Link>
              </Button>
            </ItemActions>
          </Item>
          {gameList.map((game) => (
            <Item variant="muted" key={game.mode}>
              <ItemMedia>
                <Image
                  src={game.icon}
                  alt={game.displayName}
                  width={42}
                  height={42}
                />
              </ItemMedia>
              <ItemContent>
                <ItemTitle className="text-primary">
                  {game.displayName}
                </ItemTitle>
                <ItemDescription className="m-0">{game.blurb}</ItemDescription>
              </ItemContent>
              <ItemActions>
                <Button size="sm" asChild className="font-bold">
                  <Link href={`/play/${game.mode}`} prefetch={false}>
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
