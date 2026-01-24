"use client";

import { Button } from "@/components/ui/button";
import HoverPrefetchLink from "@/components/shared/hover-prefetch-link";
import { sendEvent } from "@/lib/analytics";
import { SaltongMode, SaltongRound } from "@/features/saltong/types";
import { useModalStore } from "@/providers/modal/modal-provider";
import { useEffect } from "react";
import { useLocalStorage } from "usehooks-ts";
import { VaultIcon, CrownIcon } from "lucide-react";
import ResultsDialog from "./results-dialog";
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
  const [hasSeenHowToPlay, setHasSeenHowToPlay] = useLocalStorage(
    `saltong-results-has-seen-how-to-play-${mode}`,
    false
  );

  useEffect(() => {
    if (isOpen && !hasSeenHowToPlay) {
      setHasSeenHowToPlay(true);
    }
  }, [isOpen, hasSeenHowToPlay, setHasSeenHowToPlay]);

  useEffect(() => {
    if (!hasSeenHowToPlay && !isOpen) {
      onOpenChange(true);
    }
  }, [hasSeenHowToPlay, isOpen, onOpenChange]);

  const defaultTab: "share" | "how-to-play" = hasSeenHowToPlay
    ? "share"
    : "how-to-play";

  return (
    <>
      <ResultsDialog
        open={isOpen}
        onOpenChange={onOpenChange}
        gameDate={gameDate}
        roundData={roundData}
        userId={userId}
        defaultTab={defaultTab}
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
        className="gap-1.5 font-bold md:w-auto md:px-2"
        // disabled={!playerStats}
        title={!playerStats ? "Play a game to view stats" : undefined}
      >
        <CrownIcon className="h-[1.2rem] w-[1.2rem]" />
        <span className="hidden md:inline-block">Stats</span>
        <span className="sr-only">Stats</span>
      </Button>
      <Button
        variant="outline"
        size="icon"
        className="gap-1.5 font-bold md:w-auto md:px-2"
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
