"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { BadgeQuestionMarkIcon } from "lucide-react";
import { useState } from "react";
import { useIsClient, useLocalStorage } from "usehooks-ts";

const EXAMPLE_GRID = [
  [5, 3, 4, 6, 7, 8, 9, 1, 2],
  [6, 7, 2, 1, 9, 5, 3, 4, 8],
  [1, 9, 8, 3, 4, 2, 5, 6, 7],
  [8, 5, 9, 7, 6, 1, 4, 2, 3],
  [4, 2, 6, 8, 5, 3, 7, 9, 1],
  [7, 1, 3, 9, 2, 4, 8, 5, 6],
  [9, 6, 1, 5, 3, 7, 2, 8, 4],
  [2, 8, 7, 4, 1, 9, 6, 3, 5],
  [3, 4, 5, 2, 8, 6, 1, 7, 9],
] as const;

const PLAY_TIPS = [
  "Tap a cell, then select a number.",
  "Rows, columns, and blocks cannot repeat a number.",
  "Use Notes to mark possible numbers when a cell has several options.",
  "If you got stuck, use the hint button to help you solve the puzzle!",
] as const;

const SETTINGS = [
  ["Fill Cell with Notes", "list down the possible values of the cell."],
  [
    "Fill Grid with Notes",
    "fill up all empty cells with their possible values.",
  ],
  ["Auto-Notes", "keeps notes updated after each entry."],
  ["Check Cell", "check if the selected cell has the correct value."],
  ["Check Grid", "checks every filled cell if it's correct."],
  ["Auto-Check", "checks your answer as you submit it."],
  ["Delete Notes", "removes all notes."],
  ["Clear Grid", "resets your entries and notes."],
] as const;

const EXAMPLE_SELECTED_CELL = { row: 1, col: 1 } as const;
const NOTE_EXAMPLE_CANDIDATES = [2, 4, 7] as const;

function ExampleBoard() {
  return (
    <>
      <style>
        {`
          @keyframes sudoku-example-row-highlight {
            0%, 28% { opacity: 1; transform: scale(1); }
            33%, 100% { opacity: 0; transform: scale(0.94); }
          }

          @keyframes sudoku-example-column-highlight {
            0%, 28% { opacity: 0; transform: scale(0.94); }
            33%, 61% { opacity: 1; transform: scale(1); }
            66%, 100% { opacity: 0; transform: scale(0.94); }
          }

          @keyframes sudoku-example-block-highlight {
            0%, 61% { opacity: 0; transform: scale(0.94); }
            66%, 94% { opacity: 1; transform: scale(1); }
            100% { opacity: 0; transform: scale(0.94); }
          }
        `}
      </style>
      <div
        aria-hidden
        className="border-primary bg-background mx-auto grid aspect-square w-full max-w-[18rem] grid-cols-9 overflow-hidden rounded-md border-2 shadow-sm"
      >
        {EXAMPLE_GRID.flatMap((row, rowIndex) =>
          row.map((value, colIndex) => {
            const isRow = rowIndex === EXAMPLE_SELECTED_CELL.row;
            const isColumn = colIndex === EXAMPLE_SELECTED_CELL.col;
            const isBlock = rowIndex < 3 && colIndex < 3;
            const isSelected =
              rowIndex === EXAMPLE_SELECTED_CELL.row &&
              colIndex === EXAMPLE_SELECTED_CELL.col;

            return (
              <div
                key={`${rowIndex}-${colIndex}`}
                className={[
                  "border-primary/35 relative flex aspect-square items-center justify-center overflow-hidden border text-sm font-black sm:text-base",
                  colIndex === 2 || colIndex === 5 ? "border-r-2" : "",
                  rowIndex === 2 || rowIndex === 5 ? "border-b-2" : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
              >
                {isRow && (
                  <span className="bg-saltong-green-100 dark:bg-saltong-green-900/45 pointer-events-none absolute inset-0 [animation:sudoku-example-row-highlight_4.8s_ease-in-out_infinite]" />
                )}
                {isColumn && (
                  <span className="bg-saltong-blue-100 dark:bg-saltong-blue-900/45 pointer-events-none absolute inset-0 [animation:sudoku-example-column-highlight_4.8s_ease-in-out_infinite]" />
                )}
                {isBlock && (
                  <span className="bg-saltong-orange-100 dark:bg-saltong-orange-900/45 pointer-events-none absolute inset-0 [animation:sudoku-example-block-highlight_4.8s_ease-in-out_infinite]" />
                )}
                {isSelected && (
                  <span className="ring-saltong-orange-500 dark:ring-saltong-orange-300 pointer-events-none absolute inset-0 z-10 ring-2 ring-inset" />
                )}
                <span className="relative z-10">
                  <span
                    className={cn("opacity-60", {
                      "opacity-100": isRow || isColumn || isBlock,
                    })}
                  >
                    {value}
                  </span>
                </span>
              </div>
            );
          })
        )}
      </div>
    </>
  );
}

function NotesCellExample() {
  return (
    <div
      aria-hidden
      className="border-primary/35 bg-background text-primary/65 mt-3 grid size-16 grid-cols-3 grid-rows-3 place-items-center rounded border font-[family-name:var(--font-handwriting)] text-sm leading-none shadow-sm sm:size-20 sm:text-base dark:bg-stone-900/70"
    >
      {Array.from({ length: 9 }, (_, index) => {
        const candidate = index + 1;

        return (
          <span
            key={candidate}
            className={
              NOTE_EXAMPLE_CANDIDATES.includes(
                candidate as (typeof NOTE_EXAMPLE_CANDIDATES)[number]
              )
                ? "text-current"
                : "invisible"
            }
          >
            {candidate}
          </span>
        );
      })}
    </div>
  );
}

export default function SudokuHowToPlay() {
  const [isOpen, setIsOpen] = useState(false);
  const isClient = useIsClient();
  const [hasSeenHowToPlay, setHasSeenHowToPlay] = useLocalStorage(
    "sudoku-has-seen-how-to-play",
    false,
    { initializeWithValue: false }
  );
  const open = isOpen || (isClient && !hasSeenHowToPlay);

  const handleOpenChange = (nextOpen: boolean) => {
    if (!hasSeenHowToPlay) {
      setHasSeenHowToPlay(true);
    }
    setIsOpen(nextOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" size="respIcon">
          <BadgeQuestionMarkIcon />
          <span className="hidden md:block">How to Play</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="decoration-0">How to Play</DialogTitle>
        </DialogHeader>
        <div className="no-scrollbar -mx-4 max-h-[50vh] overflow-y-auto px-4">
          <div className="space-y-6">
            <div>
              <p className="text-muted-foreground mt-1 text-sm">
                Fill the board so every row, column, and block has 1-9.
              </p>
            </div>
            <ExampleBoard />
            <section className="rounded-lg border p-4">
              <p className="text-sm leading-6">
                Each{" "}
                <span className="bg-saltong-green-100 text-saltong-green-800 dark:bg-saltong-green-900/45 dark:text-saltong-green-100 rounded px-1 font-semibold">
                  row
                </span>
                ,{" "}
                <span className="bg-saltong-blue-100 text-saltong-blue-800 dark:bg-saltong-blue-900/45 dark:text-saltong-blue-100 rounded px-1 font-semibold">
                  column
                </span>
                , and{" "}
                <span className="bg-saltong-orange-100 text-saltong-orange-800 dark:bg-saltong-orange-900/45 dark:text-saltong-orange-100 rounded px-1 font-semibold">
                  block
                </span>{" "}
                must contain the numbers 1-9, with no repeats.
              </p>
            </section>
            <section className="space-y-3">
              <h3 className="text-lg font-black">Play modes and tips</h3>
              <ul className="text-muted-foreground list-disc space-y-2 pl-5 text-sm leading-6">
                {PLAY_TIPS.map((tip) => (
                  <li key={tip}>
                    {tip}
                    {tip ===
                      "Use Notes to mark possible numbers when a cell has several options." && (
                      <NotesCellExample />
                    )}
                  </li>
                ))}
              </ul>
            </section>
            <section className="space-y-3">
              <h3 className="text-lg font-black">Settings</h3>
              <div className="divide-border divide-y rounded-lg border">
                {SETTINGS.map(([name, description]) => (
                  <div key={name} className="p-3 text-sm leading-6">
                    <span className="font-bold">{name}</span>{" "}
                    <span className="text-muted-foreground">{description}</span>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
        <DialogFooter className="border-t px-6 py-4">
          <DialogClose asChild>
            <Button className="w-full" variant="outline">
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
