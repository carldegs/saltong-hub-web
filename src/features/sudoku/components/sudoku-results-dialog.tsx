"use client";

import ShareButton from "@/components/shared/share-button";
import { NavbarBrand } from "@/components/shared/navbar";
import { Button } from "@/components/ui/button";
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
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { HEX_CONFIG } from "@/features/hex/config";
import ContributeItem from "@/features/saltong/components/results/contribute-item";
import { SALTONG_CONFIG } from "@/features/saltong/config";
import { sendEvent } from "@/lib/analytics";
import { cn } from "@/lib/utils";
import { useModalStore } from "@/providers/modal/modal-provider";
import { getDurationString } from "@/utils/time";
import {
  CopyIcon,
  PlayIcon,
  Share2Icon,
  TrophyIcon,
  VaultIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { ReactNode, useMemo } from "react";
import { toast } from "sonner";
import { SUDOKU_CONFIG } from "../config";
import { getSudokuGamePath, getSudokuVaultPath } from "../paths";
import { SudokuCellState, SudokuMode } from "../types";

export const SUDOKU_RESULTS_MODAL_ID = "sudoku-results";

const SUDOKU_MODE_ORDER: SudokuMode[] = ["easy", "medium", "hard", "bathala"];

const getNextSudokuMode = (mode: SudokuMode) => {
  const currentIndex = SUDOKU_MODE_ORDER.indexOf(mode);
  const nextIndex =
    currentIndex === -1 ? 0 : (currentIndex + 1) % SUDOKU_MODE_ORDER.length;

  return SUDOKU_MODE_ORDER[nextIndex];
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

const getShareGrid = (grid: SudokuCellState[]) => {
  const rows: string[] = [];

  for (let row = 0; row < 9; row += 1) {
    const cells = grid.slice(row * 9, row * 9 + 9);
    rows.push(
      cells
        .map((cell) => {
          if (cell.isGiven) {
            return "🟧";
          }

          return cell.value === 0 ? "⬜" : "🟩";
        })
        .join("")
    );
  }

  return rows.join("\n");
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

function SudokuPlayMoreCard({ mode }: { mode: SudokuMode }) {
  const nextMode = getNextSudokuMode(mode);
  const nextModeConfig = SUDOKU_CONFIG.modes[nextMode];
  const NextModeIcon = nextModeConfig.icon;
  const gameList = [
    ...Object.values(SALTONG_CONFIG.modes).map((game) => ({
      href: `/play${game.mode === "classic" ? "" : `/${game.mode}`}`,
      icon: game.icon,
      title: game.displayName,
      description: game.blurb,
      targetMode: game.mode,
    })),
    {
      href: "/play/hex",
      icon: HEX_CONFIG.icon,
      title: HEX_CONFIG.displayName,
      description: HEX_CONFIG.blurb,
      targetMode: "hex",
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Play More Games</CardTitle>
      </CardHeader>
      <CardDescription>
        <div className="mx-4 space-y-2">
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
              <ItemDescription className="m-0">
                Try a harder puzzle
              </ItemDescription>
            </ItemContent>
            <ItemActions>
              <Button size="sm" asChild className="font-bold">
                <Link
                  href={`/play${getSudokuGamePath(nextMode)}`}
                  prefetch={false}
                  onClick={() => {
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

          <Item variant="muted" className="rounded-lg">
            <ItemMedia className="relative">
              <Image
                src={SUDOKU_CONFIG.icon}
                alt="Sudoku"
                width={42}
                height={42}
              />
              <VaultIcon className="text-primary bg-muted absolute -right-2 -bottom-2 rounded-md" />
            </ItemMedia>
            <ItemContent>
              <ItemTitle className="text-primary">Sudoku Vault</ItemTitle>
              <ItemDescription className="m-0">
                Play previous Sudoku puzzles
              </ItemDescription>
            </ItemContent>
            <ItemActions>
              <Button size="sm" asChild className="font-bold">
                <Link
                  href={`/play${getSudokuVaultPath()}`}
                  prefetch={false}
                  onClick={() => {
                    sendEvent("button_click", {
                      location: "results_dialog",
                      action: "play_vault",
                      mode,
                    });
                  }}
                >
                  <PlayIcon />
                  PLAY
                </Link>
              </Button>
            </ItemActions>
          </Item>

          {gameList.map((game) => (
            <Item variant="muted" key={game.targetMode} className="rounded-lg">
              <ItemMedia>
                <Image
                  src={game.icon}
                  alt={game.title}
                  width={42}
                  height={42}
                />
              </ItemMedia>
              <ItemContent>
                <ItemTitle className="text-primary">{game.title}</ItemTitle>
                <ItemDescription className="m-0">
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
                        action: "play_game",
                        currentMode: mode,
                        targetMode: game.targetMode,
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

export default function SudokuResultsDialog({
  mode,
  date,
  roundId,
  grid,
  startedAt,
  completedAt,
  hintCount,
  mistakeCount,
  moveCount,
}: {
  mode: SudokuMode;
  date: string;
  roundId: number;
  grid: SudokuCellState[];
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
  const Icon = modeConfig.icon;

  const shareDetails = useMemo(() => {
    const title = `Sudoku ${modeConfig.displayName} #${roundId}`;
    const stats = [
      `Time ${elapsedText}`,
      `Hints ${hintCount}`,
      `Mistakes ${mistakeCount}`,
    ].join(" · ");

    return {
      title,
      message: `${title}\n\n${stats}\n\n${getShareGrid(grid)}\n\n${typeof window !== "undefined" ? window.location.href : ""}`,
    };
  }, [
    elapsedText,
    grid,
    hintCount,
    mistakeCount,
    modeConfig.displayName,
    roundId,
  ]);

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

          <div className="border-saltong-orange-700/20 bg-background/80 dark:border-saltong-orange-400/20 rounded-lg border p-4 text-center shadow-sm">
            <div className="bg-saltong-orange text-saltong-orange-100 mx-auto flex size-14 items-center justify-center rounded-full">
              <TrophyIcon className="size-7" />
            </div>
            <h2 className="mt-4 text-2xl font-black tracking-tight">
              Puzzle Solved
            </h2>
            <p className="text-muted-foreground mt-1 text-sm">
              Completed on {date}
            </p>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2">
            <StatTile label="Time" value={elapsedText} className="col-span-2" />
            <StatTile label="Moves" value={moveCount} />
            <StatTile label="Hints" value={hintCount} />
            <StatTile label="Mistakes" value={mistakeCount} />
            <StatTile
              label="Difficulty"
              value={
                <span className="inline-flex items-center justify-center gap-1">
                  <Icon className="size-5" />
                  {modeConfig.displayName}
                </span>
              }
            />
          </div>

          <div className="flex w-full flex-col gap-4 py-6">
            <SudokuPlayMoreCard mode={mode} />
            <ContributeItem />
          </div>

          <div className="to-background pointer-events-none sticky bottom-0 h-10 w-full bg-gradient-to-b from-transparent" />
        </div>

        <SheetFooter className="mx-auto w-full max-w-lg flex-col gap-4 px-4 pt-2 pb-6 sm:flex-col">
          <div className="mx-auto flex items-center justify-evenly gap-2">
            <ShareButton
              icon={<Share2Icon />}
              label="Share Results"
              className="w-full min-w-22"
              onClick={handleShare}
            />
            <ShareButton
              icon={<CopyIcon />}
              label="Copy Text"
              className="w-full min-w-22"
              onClick={handleCopy}
            />
          </div>
          <Button
            variant="outline"
            className="h-auto w-full py-3 font-bold"
            onClick={() => setOpenModal(null)}
          >
            Continue
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
