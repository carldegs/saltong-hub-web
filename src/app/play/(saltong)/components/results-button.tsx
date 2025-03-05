"use client";

import { Button } from "@/components/ui/button";
import { useModalStore } from "@/providers/modal/modal-provider";
import { Award } from "lucide-react";
import ResultsDialog from "./results-dialog";
import { GameMode } from "../types";
import usePlayerStats from "../hooks/usePlayerStats";

export function ResultsButton({
  mode,
  gameDate,
}: {
  mode: GameMode;
  gameDate: string;
}) {
  const { isOpen, onOpenChange } = useModalStore((state) => state);
  const [playerStats] = usePlayerStats();

  return (
    <>
      <ResultsDialog
        open={isOpen}
        onOpenChange={onOpenChange}
        mode={mode}
        gameDate={gameDate}
      />
      <Button
        variant="outline"
        onClick={() => {
          onOpenChange(true);
        }}
        size="icon"
        className="gap-1.5 font-bold md:h-auto md:w-auto md:px-2"
        disabled={!Object.keys(playerStats?.[mode] ?? {}).length}
        title={
          !Object.keys(playerStats?.[mode] ?? {}).length
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
        onClick={() => {
          onOpenChange(true);
        }}
        size="icon"
        className="gap-1.5 font-bold md:h-auto md:w-auto md:px-2"
        disabled={!Object.keys(playerStats?.[mode] ?? {}).length}
        title={
          !Object.keys(playerStats?.[mode] ?? {}).length
            ? "Play a game to view results"
            : undefined
        }
      >
        <Award className="h-[1.2rem] w-[1.2rem]" />
        <span className="hidden md:inline-block">Results</span>
        <span className="sr-only">Open Results Button</span>
      </Button>
    </>
  );
}
