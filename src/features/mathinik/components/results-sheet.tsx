import { NavbarBrand } from "@/components/shared/navbar";
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
import { useMemo } from "react";
import { toast } from "sonner";
import { MATHINIK_CONFIG } from "../config";
import type { MathinikRound } from "../type";
import { getMathinikEquationResult, type MathinikEquationRow } from "../utils";
import type { BestResult } from "./play-area-types";

function ScoreTile({
  label,
  value,
  className,
}: {
  label: string;
  value: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "border-saltong-teal-700/20 bg-background/75 dark:border-saltong-teal-400/20 rounded-lg border px-3 py-3 text-center shadow-sm backdrop-blur-sm dark:bg-zinc-950/60",
        className
      )}
    >
      <div className="text-2xl leading-none font-black">{value}</div>
      <div className="text-muted-foreground mt-1 text-xs font-bold uppercase">
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
  value: React.ReactNode;
  className?: string;
}) {
  return (
    <HighlightCardWrapper theme="teal" className={className}>
      <div className="text-saltong-teal-100 text-4xl leading-none font-black tracking-tight">
        {value}
      </div>
      <p className="text-saltong-teal-100 mt-2 font-bold tracking-widest">
        {label}
      </p>
    </HighlightCardWrapper>
  );
}

export function MathinikResultsSheet({
  open,
  onOpenChange,
  round,
  roundId,
  equations,
  bestResult,
  startedAt,
  completedAt,
  elapsedText,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  round: MathinikRound;
  roundId?: number;
  equations: MathinikEquationRow[];
  bestResult: BestResult;
  startedAt: string;
  completedAt: string | null;
  elapsedText: string;
}) {
  const validEquations = equations.filter(
    (equation) => getMathinikEquationResult(equation) !== null
  );
  const closestValue = bestResult.equationId ? bestResult.value : "--";
  const shareText = useMemo(() => {
    const title = `Mathinik${roundId ? ` #${roundId}` : ""}`;

    return [title, `🧮${validEquations.length} ⏳${elapsedText}`].join("\n");
  }, [elapsedText, roundId, validEquations.length]);

  const handleShare = async () => {
    sendEvent("mathinik_share_results", {
      action: "share",
      roundId,
      target: round.target,
      best: bestResult.value,
      difference: bestResult.difference,
    });

    try {
      if (navigator.share) {
        await navigator.share({ text: shareText });
      } else {
        await navigator.clipboard.writeText(shareText);
        toast.success("Copied results to clipboard.");
      }
    } catch (error) {
      if (error instanceof Error && error.name !== "AbortError") {
        toast.error("Failed to share results.");
      }
    }
  };

  const handleCopy = async () => {
    sendEvent("mathinik_share_results", {
      action: "copy",
      roundId,
      target: round.target,
      best: bestResult.value,
      difference: bestResult.difference,
    });

    try {
      await navigator.clipboard.writeText(shareText);
      toast.success("Copied results to clipboard.");
    } catch {
      toast.error("Failed to copy results.");
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="bottom"
        className="no-scrollbar grid h-dvh grid-rows-[1fr_auto] overflow-y-auto p-0"
      >
        <SheetHeader className="sr-only">
          <SheetTitle>Mathinik Results</SheetTitle>
        </SheetHeader>
        <div className="no-scrollbar relative mx-auto w-full max-w-lg overflow-y-auto px-4 pt-6">
          <NavbarBrand
            colorScheme="teal"
            title={MATHINIK_CONFIG.displayName}
            icon={MATHINIK_CONFIG.icon}
            hideMenu
            forceLarge
            boxed={roundId ? `#${roundId}` : undefined}
            className="mb-8"
          />

          <div className="grid grid-cols-[1fr_auto] gap-2">
            <TimeCard
              startTime={startedAt}
              endTime={completedAt ?? startedAt}
              theme="teal"
            />
            <HighlightTile
              label="TARGET"
              value={round.target}
              className="aspect-square w-full"
            />
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2">
            <ScoreTile label="Closest" value={closestValue} />
            <ScoreTile label="Equations" value={validEquations.length} />
          </div>

          <div className="flex w-full flex-col gap-4 py-6">
            <ResultPlayMoreCard currentGameId="mathinik" />
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
