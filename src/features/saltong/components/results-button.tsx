"use client";

import { Button } from "@/components/ui/button";
import { useModalStore } from "@/providers/modal/modal-provider";
import { VaultIcon, Award } from "lucide-react";
import ResultsDialog from "./results-dialog";
import { sendEvent } from "@/lib/analytics";
import HoverPrefetchLink from "@/components/shared/hover-prefetch-link";
import { SaltongMode, SaltongRound } from "@/features/saltong/types";
import { useSaltongUserStats } from "../hooks/user-stats";

export function ResultsButton({
  mode,
  path,
  gameDate,
  roundData,
  userId = "unauthenticated",
}: {
  mode: SaltongMode;
  path: string;
  gameDate: string;
  roundData: SaltongRound;
  userId?: string;
}) {
  const { isOpen, onOpenChange } = useModalStore((state) => state);
  const { data: playerStats } = useSaltongUserStats({
    userId,
    mode,
  });

  console.log({ playerStats });

  return (
    <>
      <ResultsDialog
        open={isOpen}
        onOpenChange={onOpenChange}
        gameDate={gameDate}
        roundData={roundData}
        userId={userId}
      />
      <Button
        variant="outline"
        onClick={() => {
          onOpenChange(true);
          sendEvent("open_results", {
            mode,
            gameDate,
            roundId: roundData.roundId,
          });
        }}
        size="icon"
        className="gap-1.5 font-bold md:h-auto md:w-auto md:px-2"
        disabled={!playerStats}
        title={!playerStats ? "Play a game to view results" : undefined}
      >
        <Award className="h-[1.2rem] w-[1.2rem]" />
        <span className="hidden md:inline-block">Results</span>
        <span className="sr-only">Open Results Button</span>
      </Button>
      <Button
        variant="outline"
        size="icon"
        className="gap-1.5 font-bold md:h-auto md:w-auto md:px-2"
        disabled={!playerStats}
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
