"use client";

import { Button } from "@/components/ui/button";
import { useModalStore } from "@/providers/modal/modal-provider";
import { VaultIcon, Award } from "lucide-react";
import ResultsDialog from "./results-dialog";
import { SaltongRound } from "../types";
import usePlayerStats from "../hooks/usePlayerStats";
import { GameId } from "../../types";
import { sendEvent } from "@/lib/analytics";
import HoverPrefetchLink from "@/components/shared/hover-prefetch-link";

export function ResultsButton({
  gameId,
  path,
  gameDate,
  roundData,
}: {
  gameId: GameId;
  path: string;
  gameDate: string;
  roundData: SaltongRound;
}) {
  const { isOpen, onOpenChange } = useModalStore((state) => state);
  const [playerStats] = usePlayerStats();

  return (
    <>
      <ResultsDialog
        open={isOpen}
        onOpenChange={onOpenChange}
        gameId={gameId}
        gameDate={gameDate}
        roundData={roundData}
      />
      <Button
        variant="outline"
        onClick={() => {
          onOpenChange(true);
          sendEvent("open_results", {
            gameId,
            gameDate,
            roundId: roundData.gameId,
          });
        }}
        size="icon"
        className="gap-1.5 font-bold md:h-auto md:w-auto md:px-2"
        disabled={!Object.keys(playerStats?.[gameId] ?? {}).length}
        title={
          !Object.keys(playerStats?.[gameId] ?? {}).length
            ? "Play a game to view results"
            : undefined
        }
      >
        <Award className="h-[1.2rem] w-[1.2rem]" />
        <span className="hidden md:inline-block">Results</span>
        <span className="sr-only">Open Results Button</span>
      </Button>
      <Button
        variant="outline"
        size="icon"
        className="gap-1.5 font-bold md:h-auto md:w-auto md:px-2"
        disabled={!Object.keys(playerStats?.[gameId] ?? {}).length}
        title="Play previous games"
        asChild
      >
        <HoverPrefetchLink href={`/play${path}/vault`}>
          <VaultIcon className="h-[1.2rem] w-[1.2rem]" />
          <span className="hidden md:inline-block">Vault</span>
          <span className="sr-only">Vault</span>
        </HoverPrefetchLink>
      </Button>
    </>
  );
}
