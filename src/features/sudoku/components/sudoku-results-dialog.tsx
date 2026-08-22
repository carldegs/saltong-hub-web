"use client";

import { NavbarBrand } from "@/components/shared/navbar";
import { Button } from "@/components/ui/button";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import ResultPlayMoreCard from "@/features/game-registry/components/result-play-more-card";
import ResultShareButtons from "@/features/game-registry/components/result-share-buttons";
import ContributeItem from "@/features/saltong/components/results/contribute-item";
import { HighlightCardWrapper } from "@/features/saltong/components/results/highlight-card-wrapper";
import { TimeCard } from "@/features/saltong/components/results/time-card";
import { sendEvent } from "@/lib/analytics";
import { cn } from "@/lib/utils";
import { useModalStore } from "@/providers/modal/modal-provider";
import { getDurationString } from "@/utils/time";
import { PlayIcon } from "lucide-react";
import Link from "next/link";
import { ReactNode, useMemo } from "react";
import { toast } from "sonner";
import { SUDOKU_CONFIG } from "../config";
import { getSudokuGamePath } from "../paths";
import { SudokuMode } from "../types";

export const SUDOKU_RESULTS_MODAL_ID = "sudoku-results";

const SUDOKU_MODE_ORDER: SudokuMode[] = ["easy", "medium", "hard", "bathala"];

const getNextSudokuMode = (mode: SudokuMode) => {
  const currentIndex = SUDOKU_MODE_ORDER.indexOf(mode);
  const nextIndex = currentIndex + 1;

  return SUDOKU_MODE_ORDER[nextIndex] ?? null;
};

const getElapsedMs = ({
  startedAt,
  completedAt,
}: {
  startedAt: string;
  completedAt: string | null;
}) => {
  if (!completedAt) {
    return 0;
  }

  return Math.max(
    0,
    new Date(completedAt).getTime() - new Date(startedAt).getTime()
  );
};

function StatTile({
  label,
  value,
  className,
}: {
  label: string;
  value: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "border-saltong-orange-700/20 bg-saltong-orange-50/80 dark:border-saltong-orange-400/20 dark:bg-saltong-orange-950/35 rounded-lg border px-3 py-3 text-center",
        className
      )}
    >
      <div className="text-saltong-orange-950 dark:text-saltong-orange-50 text-2xl leading-none font-black">
        {value}
      </div>
      <div className="text-muted-foreground mt-1 text-xs font-bold tracking-wide uppercase">
        {label}
      </div>
    </div>
  );
}

function HighlightTile({
  label,
  value,
  className,
}: {
  label: string;
  value: ReactNode;
  className?: string;
}) {
  return (
    <HighlightCardWrapper theme="orange" className={className}>
      <div className="text-saltong-orange-100 text-4xl leading-none font-black tracking-tight">
        {value}
      </div>
      <p className="text-saltong-orange-100 mt-2 font-bold tracking-widest">
        {label}
      </p>
    </HighlightCardWrapper>
  );
}

function SudokuNextDifficultyItem({ mode }: { mode: SudokuMode }) {
  const setOpenModal = useModalStore((state) => state.setOpenModal);
  const nextMode = getNextSudokuMode(mode);
  if (!nextMode) {
    return null;
  }

  const nextModeConfig = SUDOKU_CONFIG.modes[nextMode];
  const NextModeIcon = nextModeConfig.icon;

  return (
    <Item variant="muted" className="rounded-lg">
      <ItemMedia>
        <div className="bg-saltong-orange/10 text-saltong-orange flex size-[42px] items-center justify-center rounded-lg">
          <NextModeIcon className="size-7" />
        </div>
      </ItemMedia>
      <ItemContent>
        <ItemTitle className="text-primary">
          Sudoku {nextModeConfig.displayName}
        </ItemTitle>
        <ItemDescription className="m-0">Try a harder puzzle</ItemDescription>
      </ItemContent>
      <ItemActions>
        <Button size="sm" asChild className="font-bold">
          <Link
            href={`/play${getSudokuGamePath(nextMode)}`}
            prefetch={false}
            onClick={() => {
              setOpenModal(null);
              sendEvent("button_click", {
                location: "results_dialog",
                action: "play_game",
                currentMode: mode,
                targetMode: nextMode,
              });
            }}
          >
            <PlayIcon />
            PLAY
          </Link>
        </Button>
      </ItemActions>
    </Item>
  );
}

export default function SudokuResultsDialog({
  mode,
  date,
  roundId,
  startedAt,
  completedAt,
  hintCount,
  mistakeCount,
  moveCount,
}: {
  mode: SudokuMode;
  date: string;
  roundId: number;
  startedAt: string;
  completedAt: string | null;
  hintCount: number;
  mistakeCount: number;
  moveCount: number;
}) {
  const isOpen = useModalStore(
    (state) => state.openModal === SUDOKU_RESULTS_MODAL_ID
  );
  const setOpenModal = useModalStore((state) => state.setOpenModal);
  const modeConfig = SUDOKU_CONFIG.modes[mode];
  const elapsedMs = getElapsedMs({ startedAt, completedAt });
  const elapsedText = getDurationString(elapsedMs) || "0s";

  const shareDetails = useMemo(() => {
    const title = `Sudoku ${modeConfig.displayName} #${roundId}`;

    return {
      title,
      message: `${title}\n⏳ ${elapsedText}`,
    };
  }, [elapsedText, modeConfig.displayName, roundId]);

  const handleOpenChange = (open: boolean) => {
    setOpenModal(open ? SUDOKU_RESULTS_MODAL_ID : null);
  };

  const handleShare = async () => {
    sendEvent("sudoku_share_results", {
      action: "share",
      mode,
      date,
      roundId,
      hintCount,
      mistakeCount,
      moveCount,
    });

    try {
      if (navigator.share) {
        await navigator.share({ text: shareDetails.message });
      } else {
        await navigator.clipboard.writeText(shareDetails.message);
        toast.success("Copied to clipboard");
      }
    } catch (error) {
      if (error instanceof Error && error.name !== "AbortError") {
        toast.error("Failed to share");
      }
    }
  };

  const handleCopy = async () => {
    sendEvent("sudoku_share_results", {
      action: "copy",
      mode,
      date,
      roundId,
      hintCount,
      mistakeCount,
      moveCount,
    });

    try {
      await navigator.clipboard.writeText(shareDetails.message);
      toast.success("Copied to clipboard");
    } catch {
      toast.error("Failed to copy");
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={handleOpenChange}>
      <SheetContent
        side="bottom"
        className="no-scrollbar grid h-dvh grid-rows-[1fr_auto] overflow-y-auto p-0"
      >
        <SheetHeader className="sr-only">
          <SheetTitle>Sudoku Results</SheetTitle>
        </SheetHeader>

        <div className="no-scrollbar relative mx-auto w-full max-w-lg overflow-y-auto px-4 pt-6">
          <NavbarBrand
            colorScheme="orange"
            title="Sudoku"
            subtitle={modeConfig.displayName}
            icon={SUDOKU_CONFIG.icon}
            hideMenu
            forceLarge
            boxed={`#${roundId}`}
            className="mb-8"
          />

          <div className="grid grid-cols-[1fr_auto] gap-2">
            <TimeCard
              startTime={startedAt}
              endTime={completedAt ?? startedAt}
              theme="orange"
            />
            <HighlightTile
              label="MOVES"
              value={moveCount}
              className="aspect-square w-full"
            />
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2">
            <StatTile label="Hints" value={hintCount} />
            <StatTile label="Mistakes" value={mistakeCount} />
          </div>

          <div className="flex w-full flex-col gap-4 py-6">
            <ResultPlayMoreCard
              currentGameId="sudoku"
              currentMode={mode}
              leadingItems={[
                <SudokuNextDifficultyItem key="next" mode={mode} />,
              ]}
            />
            <ContributeItem />
          </div>

          <div className="to-background pointer-events-none sticky bottom-0 h-10 w-full bg-gradient-to-b from-transparent" />
        </div>

        <SheetFooter className="mx-auto w-full max-w-lg flex-col gap-4 px-4 pt-2 pb-6 sm:flex-col">
          <ResultShareButtons onShare={handleShare} onCopy={handleCopy} />
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
