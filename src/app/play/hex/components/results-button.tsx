"use client";

import { Button } from "@/components/ui/button";
import { useModalStore } from "@/providers/modal/modal-provider";
import { VaultIcon, CrownIcon } from "lucide-react";
import Link from "next/link";
import ResultsDialog from "./results-dialog";
import { HexRound } from "../types";
import { sendEvent } from "@/lib/analytics";

export function ResultsButton({
  gameDate,
  round,
}: {
  gameDate: string;
  isLive: boolean;
  round: HexRound;
}) {
  const { isOpen, onOpenChange } = useModalStore((state) => state);

  return (
    <>
      <ResultsDialog
        open={isOpen}
        onOpenChange={onOpenChange}
        gameDate={gameDate}
        round={round}
      />
      <Button
        variant="outline"
        onClick={() => {
          sendEvent("open_results", {
            gameId: "hex",
            gameDate,
            roundId: round.gameId,
          });
          onOpenChange(true);
        }}
        size="icon"
        className="gap-1.5 font-bold md:h-auto md:w-auto md:px-2"
      >
        <CrownIcon className="h-[1.2rem] w-[1.2rem]" />
        <span className="hidden md:inline-block">Stats</span>
        <span className="sr-only">Stats</span>
      </Button>
      <Button
        variant="outline"
        size="icon"
        className="gap-1.5 font-bold md:h-auto md:w-auto md:px-2"
        title="Play previous games"
        asChild
      >
        <Link href="/play/hex/vault" prefetch={false}>
          <VaultIcon className="h-[1.2rem] w-[1.2rem]" />
          <span className="hidden md:inline-block">Vault</span>
          <span className="sr-only">Vault</span>
        </Link>
      </Button>
    </>
  );
}
