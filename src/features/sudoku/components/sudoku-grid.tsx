"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useModalStore } from "@/providers/modal/modal-provider";
import { LightbulbIcon, XIcon } from "lucide-react";
import { KeyboardEvent, useEffect, useRef, useState } from "react";
import { triggerSuccessConfetti } from "@/features/saltong/components/results/utils";
import { getSudokuHint, type SudokuHint } from "../hints";
import useSudokuGrid from "../hooks/use-sudoku-grid";
import { Pos, SudokuCellVisualState, SudokuMode } from "../types";
import { getIdxFromPos } from "../utils";
import SudokuController from "./sudoku-controller";
import SudokuResultsDialog, {
  SUDOKU_RESULTS_MODAL_ID,
} from "./sudoku-results-dialog";

const SUDOKU_VALUES = [1, 2, 3, 4, 5, 6, 7, 8, 9];

const isSamePos = (a: Pos, b: Pos) => a.col === b.col && a.row === b.row;

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
        "bg-background [container-type:size] relative flex aspect-square cursor-pointer items-center justify-center overflow-hidden border-[0.5px] border-[color:rgba(120,53,15,0.22)] font-semibold transition-colors dark:border-[color:rgba(251,191,36,0.14)] dark:bg-[color:rgba(28,25,23,0.74)]"
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
    <div className="relative grid h-full w-full grid-cols-3 grid-rows-3 outline-2 outline-[color:rgba(120,53,15,0.46)] dark:outline-[color:rgba(251,191,36,0.24)]">
      {children}
    </div>
  );
}

export default function SudokuGrid({
  puzzle,
  solution,
  mode,
  date,
  roundId,
}: {
  puzzle: number[];
  solution: number[];
  mode: SudokuMode;
  date: string;
  roundId: number;
}) {
  const {
    grid,
    inputMode,
    autoCandidates,
    autoCheck,
    hintCount,
    mistakeCount,
    moveCount,
    startedAt,
    completedAt,
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
    incrementHintCount,
  } = useSudokuGrid({ puzzle, solution });
  const setOpenModal = useModalStore((state) => state.setOpenModal);
  const gridSize = Math.sqrt(grid.length);
  const cellRefs = useRef<Array<HTMLDivElement | null>>([]);
  const wasCompleteRef = useRef(isComplete);
  const confettiShownRef = useRef(false);
  const [hint, setHint] = useState<SudokuHint | null>(null);
  const selectedIndex = selectedCell
    ? getIdxFromPos(selectedCell.pos, gridSize)
    : undefined;

  useEffect(() => {
    if (!selectedCell) {
      return;
    }

    cellRefs.current[getIdxFromPos(selectedCell.pos, gridSize)]?.focus();
  }, [gridSize, selectedCell]);

  useEffect(() => {
    if (isComplete && !wasCompleteRef.current) {
      if (!confettiShownRef.current) {
        confettiShownRef.current = true;
        triggerSuccessConfetti();
      }
      setOpenModal(SUDOKU_RESULTS_MODAL_ID);
    }

    wasCompleteRef.current = isComplete;
  }, [isComplete, setOpenModal]);

  const selectCellFromUser = (pos: Pos) => {
    if (hint && (!hint.pos || !isSamePos(hint.pos, pos))) {
      setHint(null);
    }

    selectCell(pos);
  };

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

      selectCellFromUser(nextPos);
      return;
    }

    if (/^\d$/.test(key)) {
      event.preventDefault();

      if (isComplete) {
        return;
      }

      const value = Number(key);

      if (value <= gridSize || value === 0) {
        enterValue(value, pos);
        selectCellFromUser(pos);
      }

      return;
    }

    if (key === "Backspace" || key === "Delete") {
      event.preventDefault();
      if (isComplete) {
        return;
      }
      clearCell(pos);
      selectCellFromUser(pos);
    }
  };

  const showHint = () => {
    const nextHint = getSudokuHint(grid, solution);

    setHint(nextHint);
    incrementHintCount();

    if (nextHint.pos) {
      selectCell(nextHint.pos);
    }
  };

  return (
    <div className="mx-auto flex h-full min-h-0 w-full max-w-[58rem] flex-col items-center justify-center gap-2 [--sudoku-board-size:min(calc(100vw-1rem),calc(48svh-4.75rem),42rem)] sm:gap-4 sm:[--sudoku-board-size:min(calc(100vw-2rem),calc(50svh-4.75rem),44rem)] lg:flex-row lg:items-start lg:gap-7 lg:[--sudoku-board-size:min(34rem,calc(100vw-24rem),calc(100svh-12rem))]">
      <div className="flex w-[var(--sudoku-board-size)] flex-col gap-3">
        <div className="relative grid aspect-square w-full grid-cols-3 overflow-hidden bg-[radial-gradient(circle_at_20%_18%,rgba(255,255,255,0.75),transparent_28%),linear-gradient(135deg,rgba(254,235,200,0.95),rgba(252,211,141,0.72)_48%,rgba(217,119,6,0.28))] shadow-[0_18px_50px_rgba(120,53,15,0.16)] outline-4 outline-[color:rgba(120,53,15,0.58)] dark:bg-[radial-gradient(circle_at_20%_18%,rgba(120,53,15,0.22),transparent_30%),linear-gradient(135deg,rgba(69,20,3,0.92),rgba(41,37,36,0.96)_52%,rgba(15,23,42,0.88))] dark:shadow-[0_18px_50px_rgba(0,0,0,0.35)] dark:outline-[color:rgba(251,191,36,0.28)]">
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
                    onClick={(pos) => selectCellFromUser(pos)}
                    onFocus={(pos) => selectCellFromUser(pos)}
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

        <div className="h-[4.25rem] overflow-hidden sm:h-[4.5rem]">
          {hint && (
            <Alert className="border-saltong-orange-700/30 bg-saltong-orange-50/95 text-saltong-orange-950 dark:border-saltong-orange-400/30 dark:bg-saltong-orange-950/70 dark:text-saltong-orange-50 pr-11 shadow-sm backdrop-blur-sm">
              <LightbulbIcon className="text-saltong-orange-700 dark:text-saltong-orange-200" />
              <AlertDescription className="text-saltong-orange-900 dark:text-saltong-orange-100 line-clamp-2">
                <p>{hint.message}</p>
              </AlertDescription>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label="Dismiss hint"
                className="absolute top-2 right-2 size-7"
                onClick={() => setHint(null)}
              >
                <XIcon className="size-4" />
              </Button>
            </Alert>
          )}
        </div>
      </div>

      <div className="flex w-[var(--sudoku-board-size)] flex-col gap-2 lg:w-[17rem] xl:w-[18.5rem]">
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
          onHint={showHint}
          hintCount={hintCount}
          mistakeCount={mistakeCount}
          readOnly={isComplete}
        />

        {isComplete && (
          <Button
            type="button"
            size="lg"
            className="w-full font-bold"
            onClick={() => setOpenModal(SUDOKU_RESULTS_MODAL_ID)}
          >
            View Results
          </Button>
        )}
      </div>

      <SudokuResultsDialog
        mode={mode}
        date={date}
        roundId={roundId}
        startedAt={startedAt}
        completedAt={completedAt}
        hintCount={hintCount}
        mistakeCount={mistakeCount}
        moveCount={moveCount}
      />
    </div>
  );
}
