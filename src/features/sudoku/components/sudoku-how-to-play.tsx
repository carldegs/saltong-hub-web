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
import { BadgeQuestionMarkIcon } from "lucide-react";

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
  "Rows, columns, and 3x3 boxes cannot repeat a number.",
  "Use Notes to mark possible numbers when a cell has several options.",
  "Use Hint when you want the next simple logical clue.",
] as const;

const SETTINGS = [
  ["Fill Cell Candidate", "adds every legal note to the selected cell."],
  ["Fill Grid Candidates", "adds legal notes to every empty cell."],
  ["Auto-Candidates", "keeps notes updated after each entry."],
  ["Check Cell", "checks the selected filled cell."],
  ["Check Grid", "checks every filled cell."],
  ["Auto-Check", "checks entries as you make them."],
  ["Delete Candidates", "removes all notes."],
  ["Clear Grid", "resets your entries and notes."],
] as const;

function ExampleBoard() {
  return (
    <div
      aria-hidden
      className="border-primary bg-background mx-auto grid aspect-square w-full max-w-[18rem] grid-cols-9 overflow-hidden rounded-md border-2 shadow-sm"
    >
      {EXAMPLE_GRID.flatMap((row, rowIndex) =>
        row.map((value, colIndex) => {
          const isRow = rowIndex === 0;
          const isColumn = colIndex === 0;
          const isBox = rowIndex < 3 && colIndex < 3;

          return (
            <div
              key={`${rowIndex}-${colIndex}`}
              className={[
                "border-primary/35 flex aspect-square items-center justify-center border text-sm font-black sm:text-base",
                isBox && "bg-saltong-orange-100 dark:bg-saltong-orange-900/35",
                isRow && "bg-saltong-green-100 dark:bg-saltong-green-900/35",
                isColumn && "bg-saltong-blue-100 dark:bg-saltong-blue-900/35",
                colIndex === 2 || colIndex === 5 ? "border-r-2" : "",
                rowIndex === 2 || rowIndex === 5 ? "border-b-2" : "",
              ]
                .filter(Boolean)
                .join(" ")}
            >
              {value}
            </div>
          );
        })
      )}
    </div>
  );
}

export default function SudokuHowToPlay() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="respIcon">
          <BadgeQuestionMarkIcon />
          <span className="hidden md:block">How to Play</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="grid max-h-[calc(100dvh-2rem)] grid-rows-[auto_1fr_auto] gap-0 overflow-hidden p-0 sm:max-w-2xl">
        <DialogHeader className="border-b px-6 py-5 text-left">
          <DialogTitle className="text-2xl font-black">
            How to Play Sudoku
          </DialogTitle>
        </DialogHeader>
        <div className="no-scrollbar overflow-y-auto px-6 py-5">
          <div className="space-y-6">
            <div>
              <p className="text-muted-foreground mt-1 text-sm">
                Fill the board so every row, column, and 3x3 box has 1-9.
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
                  box
                </span>{" "}
                must contain the numbers 1-9, with no repeats.
              </p>
            </section>
            <section className="space-y-3">
              <h3 className="text-lg font-black">Play modes and tips</h3>
              <ul className="text-muted-foreground list-disc space-y-2 pl-5 text-sm leading-6">
                {PLAY_TIPS.map((tip) => (
                  <li key={tip}>{tip}</li>
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
