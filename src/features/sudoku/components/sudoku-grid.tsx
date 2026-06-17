"use client";

import { cn } from "@/lib/utils";
import { KeyboardEvent, useEffect, useRef } from "react";
import { Pos, SudokuCellVisualState } from "../types";

import {
  Popover,
  PopoverAnchor,
  PopoverContent,
} from "@/components/ui/popover";
import useSudokuGrid from "../hooks/use-sudoku-grid";
import { getIdxFromPos } from "../utils";
import SudokuController from "./sudoku-controller";

const SUDOKU_VALUES = [1, 2, 3, 4, 5, 6, 7, 8, 9];

function SudokuCell({
  value,
  candidates,
  pos,
  visualState,
  given,
  onClick,
  onFocus,
  onKeyDown,
  tabIndex,
  cellRef,
}: {
  value: number;
  candidates: number[];
  pos: Pos;
  visualState: SudokuCellVisualState;
  given?: boolean;
  onClick: (pos: Pos) => void;
  onFocus: (pos: Pos) => void;
  onKeyDown: (event: KeyboardEvent<HTMLDivElement>, pos: Pos) => void;
  tabIndex: number;
  cellRef?: (node: HTMLDivElement | null) => void;
}) {
  const hasError =
    visualState.answer === "user-error" || visualState.answer === "given-error";

  const ariaLabel = `Row ${pos.row + 1}, column ${pos.col + 1}${given ? ", given" : ""}${hasError ? ", invalid entry" : ""}`;

  return (
    <div
      ref={cellRef}
      role="button"
      tabIndex={tabIndex}
      aria-label={ariaLabel}
      className={cn(
        "border-primary [container-type:size] relative flex aspect-square cursor-pointer items-center justify-center overflow-hidden border-[0.5px] font-semibold transition-colors"
      )}
      onClick={(event) => {
        event.currentTarget.focus();
        onClick(pos);
      }}
      onFocus={() => onFocus(pos)}
      onKeyDown={(event) => onKeyDown(event, pos)}
    >
      {visualState.answer === "user-error" && (
        <div className="bg-saltong-red-600 absolute z-1 h-[145%] w-[2px] rotate-45" />
      )}
      {value === 0 ? (
        candidates.length > 0 ? (
          <div className="text-primary/50 absolute z-1 grid size-full grid-cols-3 grid-rows-3 place-items-center font-[family-name:var(--font-handwriting)] text-[clamp(0.5rem,30cqw,0.9rem)] leading-none">
            {SUDOKU_VALUES.map((candidate) => (
              <span
                key={candidate}
                className={cn(
                  "text-current",
                  !candidates.includes(candidate) && "invisible"
                )}
              >
                {candidate}
              </span>
            ))}
          </div>
        ) : null
      ) : (
        <span
          className={cn(
            "absolute z-1 text-[clamp(1.25rem,60cqw,2.25rem)] leading-none",
            {
              "text-saltong-red-600":
                visualState.answer === "user-error" ||
                visualState.answer === "given-error",
              "text-cyan-600": visualState.answer === "correct",
            }
          )}
        >
          {value}
        </span>
      )}

      <div
        className={cn("absolute z-0 size-full", {
          "bg-saltong-orange-400/80": visualState.highlight === "selected",
          "bg-saltong-orange-200/30": visualState.highlight === "related",
          "bg-saltong-orange-400/50": visualState.highlight === "same-value",
        })}
      />
      {given && <div className="absolute z-0 size-full bg-black/8" />}
    </div>
  );
}

function SudokuBlock({ children }: { children: React.ReactNode }) {
  return (
    <div className="outline-primary relative grid h-full w-full grid-cols-3 grid-rows-3 outline-2">
      {children}
    </div>
  );
}

export default function SudokuGrid({
  puzzle,
  solution,
}: {
  puzzle: number[];
  solution: number[];
}) {
  const {
    grid,
    inputMode,
    autoCandidates,
    autoCheck,
    isComplete,
    selectedCell,
    selectCell,
    setInputMode,
    setAutoCandidates,
    setAutoCheck,
    enterValue,
    clearCell,
    undo,
    fillAllCandidates,
    fillCellCandidates,
    checkCell,
    checkGrid,
    deleteCandidates,
    clearGrid,
  } = useSudokuGrid({ puzzle, solution });
  const gridSize = Math.sqrt(grid.length);
  const cellRefs = useRef<Array<HTMLDivElement | null>>([]);
  const selectedIndex = selectedCell
    ? getIdxFromPos(selectedCell.pos, gridSize)
    : undefined;

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

      if (value <= gridSize || value === 0) {
        enterValue(value, pos);
        selectCell(pos);
      }

      return;
    }

    if (key === "Backspace" || key === "Delete") {
      event.preventDefault();
      clearCell(pos);
      selectCell(pos);
    }
  };

  return (
    <div className="mx-auto flex h-full min-h-0 w-full max-w-[58rem] flex-col items-center justify-center gap-2 [--sudoku-board-size:min(calc(100vw-1rem),52svh,42rem)] sm:gap-4 sm:[--sudoku-board-size:min(calc(100vw-2rem),54svh,44rem)] lg:flex-row lg:items-start lg:gap-7 lg:[--sudoku-board-size:min(34rem,calc(100vw-24rem))]">
      <Popover open={isComplete}>
        <PopoverAnchor asChild>
          <div className="outline-primary relative grid aspect-square w-[var(--sudoku-board-size)] grid-cols-3 overflow-hidden outline-4">
            {Array.from({ length: gridSize }, (_, blockIndex) => {
              const blockRow = Math.floor(blockIndex / 3);
              const blockCol = blockIndex % 3;

              const cells = [];

              for (let cellRow = 0; cellRow < 3; cellRow += 1) {
                for (let cellCol = 0; cellCol < 3; cellCol += 1) {
                  const row = blockRow * 3 + cellRow;
                  const col = blockCol * 3 + cellCol;
                  const index = getIdxFromPos({ row, col }, gridSize);
                  const cell = grid[index];

                  if (!cell) {
                    continue;
                  }

                  cells.push(
                    <SudokuCell
                      key={`cell-[${cell.pos.col}, ${cell.pos.row}]`}
                      value={cell.value}
                      candidates={cell.candidates}
                      pos={cell.pos}
                      onClick={(pos) => selectCell(pos)}
                      onFocus={(pos) => selectCell(pos)}
                      onKeyDown={handleKeyDown}
                      given={cell.isGiven}
                      visualState={cell.visualState}
                      tabIndex={
                        selectedIndex === undefined
                          ? index === 0
                            ? 0
                            : -1
                          : index === selectedIndex
                            ? 0
                            : -1
                      }
                      cellRef={(node) => {
                        cellRefs.current[index] = node;
                      }}
                    />
                  );
                }
              }

              return (
                <SudokuBlock key={`block-${blockRow}-${blockCol}`}>
                  {cells}
                </SudokuBlock>
              );
            })}
          </div>
        </PopoverAnchor>
        <PopoverContent
          side="top"
          align="center"
          className="border-saltong-green-500/25 w-auto px-4 py-3 text-base font-bold"
        >
          Success!
        </PopoverContent>
      </Popover>

      <SudokuController
        inputMode={inputMode}
        onInputModeChange={setInputMode}
        onNumberClick={(value) => enterValue(value)}
        onClear={() => clearCell()}
        onUndo={undo}
        autoCandidates={autoCandidates}
        onAutoCandidatesChange={setAutoCandidates}
        autoCheck={autoCheck}
        onAutoCheckChange={setAutoCheck}
        onFillCellCandidates={() => fillCellCandidates()}
        onFillAllCandidates={fillAllCandidates}
        onCheckCell={() => checkCell()}
        onCheckGrid={checkGrid}
        onDeleteCandidates={deleteCandidates}
        onClearGrid={clearGrid}
        className="w-[var(--sudoku-board-size)] lg:w-[17rem] xl:w-[18.5rem]"
      />
    </div>
  );
}
