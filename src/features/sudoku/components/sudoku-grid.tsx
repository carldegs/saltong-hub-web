"use client";

import { cn } from "@/lib/utils";
import { CSSProperties, KeyboardEvent, useEffect, useRef } from "react";
import { Pos } from "../types";

import useSudokuGrid from "../hooks/use-sudoku-grid";
import { getIdxFromPos } from "../utils";

function SudokuCell({
  value,
  pos,
  selected,
  highlighted,
  highlightedValue,
  given,
  invalidUserEntry,
  invalidGiven,
  onClick,
  onFocus,
  onKeyDown,
  tabIndex,
  style,
  cellRef,
}: {
  value: number;
  pos: Pos;
  selected?: boolean;
  highlighted?: boolean;
  highlightedValue?: boolean;
  given?: boolean;
  invalidUserEntry?: boolean;
  invalidGiven?: boolean;
  onClick: (pos: Pos) => void;
  onFocus: (pos: Pos) => void;
  onKeyDown: (event: KeyboardEvent<HTMLDivElement>, pos: Pos) => void;
  tabIndex: number;
  style?: CSSProperties;
  cellRef?: (node: HTMLDivElement | null) => void;
}) {
  const backgroundClass = cn({
    "bg-red-100 dark:bg-red-600/25": !!invalidGiven,
    "bg-saltong-orange-200 dark:bg-saltong-orange-500/25":
      !invalidGiven && !!selected,
    "bg-saltong-orange-200/90 dark:bg-saltong-orange-400/22":
      !invalidGiven && !selected && !!highlightedValue,
    "bg-saltong-orange-50 dark:bg-saltong-orange-900/15":
      !invalidGiven && !selected && !highlightedValue && !!highlighted,
    "bg-background dark:bg-zinc-950":
      !invalidGiven && !selected && !highlightedValue && !highlighted,
  });

  const textClass = cn({
    "text-red-600 dark:text-red-400": !!invalidUserEntry,
    "text-foreground dark:text-zinc-50": !invalidUserEntry && !!given,
    "text-saltong-orange-700 dark:text-saltong-orange-300":
      !invalidUserEntry && !given,
  });

  return (
    <div
      ref={cellRef}
      role="button"
      tabIndex={tabIndex}
      aria-label={`Row ${pos.row + 1}, column ${pos.col + 1}${given ? ", given" : ""}${invalidUserEntry ? ", invalid entry" : ""}${invalidGiven ? ", conflicting given" : ""}`}
      className={cn(
        "flex aspect-square cursor-pointer items-center justify-center border text-xl font-semibold transition-colors sm:text-2xl lg:text-3xl",
        "border-saltong-orange-700/70 dark:border-saltong-orange-700/35",
        backgroundClass,
        textClass,
        {
          "rounded-tl-2xl": pos.row === 0 && pos.col === 0,
          "rounded-tr-2xl": pos.row === 0 && pos.col === 8,
          "rounded-bl-2xl": pos.row === 8 && pos.col === 0,
          "rounded-br-2xl": pos.row === 8 && pos.col === 8,
          "border-red-400 dark:border-red-800":
            invalidUserEntry || invalidGiven,
          "border-saltong-orange-400/90 dark:border-saltong-orange-400/55 shadow-[inset_0_0_0_1px_rgba(251,146,60,0.35)] dark:shadow-[inset_0_0_0_1px_rgba(251,191,36,0.18)]":
            highlightedValue && !selected && !invalidUserEntry && !invalidGiven,
          "border-saltong-orange-500 border-3 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.25)] dark:shadow-[inset_0_0_0_1px_rgba(251,191,36,0.24)]":
            selected && !invalidUserEntry && !invalidGiven,
          "border-3 border-red-500 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.16)] dark:border-red-500 dark:shadow-[inset_0_0_0_1px_rgba(248,113,113,0.18)]":
            selected && (invalidUserEntry || invalidGiven),
        }
      )}
      style={style}
      onClick={(event) => {
        event.currentTarget.focus();
        onClick(pos);
      }}
      onFocus={() => onFocus(pos)}
      onKeyDown={(event) => onKeyDown(event, pos)}
    >
      {value === 0 ? "" : value}
    </div>
  );
}

export default function SudokuGrid({ puzzle }: { puzzle: number[] }) {
  const { grid, selectCell, setCellValue } = useSudokuGrid(puzzle);
  const gridSize = Math.sqrt(grid.length);
  const blockSize = Math.sqrt(gridSize);
  const cellRefs = useRef<Array<HTMLDivElement | null>>([]);
  const selectedCell = grid.find((cell) => cell.isSelected);
  const gridTrackTemplate = Array.from({ length: gridSize }, (_, index) =>
    index < gridSize - 1 && (index + 1) % blockSize === 0
      ? "minmax(0, 1fr) 0.35rem"
      : "minmax(0, 1fr)"
  ).join(" ");

  useEffect(() => {
    if (!selectedCell) {
      return;
    }

    cellRefs.current[getIdxFromPos(selectedCell.pos, gridSize)]?.focus();
  }, [gridSize, selectedCell]);

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>, pos: Pos) => {
    const { key } = event;

    if (key.startsWith("Arrow")) {
      event.preventDefault();

      const nextPos = {
        row:
          key === "ArrowUp"
            ? Math.max(0, pos.row - 1)
            : key === "ArrowDown"
              ? Math.min(gridSize - 1, pos.row + 1)
              : pos.row,
        col:
          key === "ArrowLeft"
            ? Math.max(0, pos.col - 1)
            : key === "ArrowRight"
              ? Math.min(gridSize - 1, pos.col + 1)
              : pos.col,
      };

      selectCell(nextPos);
      return;
    }

    if (/^\d$/.test(key)) {
      event.preventDefault();

      const value = Number(key);

      if (value === 0) {
        setCellValue(0, pos);
        selectCell(pos);
        return;
      }

      if (value <= gridSize) {
        setCellValue(value, pos);
        selectCell(pos);
      }

      return;
    }

    if (key === "Backspace" || key === "Delete") {
      event.preventDefault();
      setCellValue(0, pos);
      selectCell(pos);
    }
  };

  return (
    <div
      className="bg-background mx-auto grid aspect-square w-full max-w-[34rem] overflow-hidden rounded-2xl shadow-[0_18px_40px_-28px_rgba(146,64,14,0.45)] dark:bg-zinc-950"
      style={{
        gridTemplateColumns: gridTrackTemplate,
        gridTemplateRows: gridTrackTemplate,
      }}
    >
      {grid.map(
        (
          {
            value,
            pos,
            isGiven,
            isSelected,
            isHighlighted,
            isHighlightedValue,
            isInvalidUserEntry,
            isInvalidGiven,
          },
          index
        ) => (
          <SudokuCell
            key={`cell-[${pos.col}, ${pos.row}]`}
            value={value}
            pos={pos}
            onClick={(pos) => selectCell(pos)}
            onFocus={(pos) => selectCell(pos)}
            onKeyDown={handleKeyDown}
            selected={isSelected}
            given={isGiven}
            highlighted={isHighlighted}
            highlightedValue={isHighlightedValue}
            invalidUserEntry={isInvalidUserEntry}
            invalidGiven={isInvalidGiven}
            style={{
              gridColumnStart: pos.col + Math.floor(pos.col / blockSize) + 1,
              gridRowStart: pos.row + Math.floor(pos.row / blockSize) + 1,
            }}
            tabIndex={
              !selectedCell ? (index === 0 ? 0 : -1) : isSelected ? 0 : -1
            }
            cellRef={(node) => {
              cellRefs.current[index] = node;
            }}
          />
        )
      )}
    </div>
  );
}
