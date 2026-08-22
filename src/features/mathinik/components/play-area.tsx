"use client";

import { Button } from "@/components/ui/button";
import { triggerSuccessConfetti } from "@/features/saltong/components/results/utils";
import { cn } from "@/lib/utils";
import { getDurationString } from "@/utils/time";
import { DeleteIcon, Trash2Icon, TrophyIcon } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { useLocalStorage } from "usehooks-ts";
import { MathinikRound } from "../type";
import {
  getMathinikEquationError,
  getMathinikEquationResult,
  isMathinikEquationComplete,
  MATHINIK_OPERATORS,
  MathinikCursor,
  MathinikEquationRow,
  MathinikEquationSlot,
  MathinikNumberSource,
  MathinikOperator,
  MathinikSlotKey,
} from "../utils";
import { MathinikGauge } from "./mathinik-gauge";
import { NumberValue } from "./mathinik-display";
import { MathinikResultsSheet } from "./results-sheet";
import { SlotButton } from "./slot-button";
import type { BestResult } from "./play-area-types";

export { MathinikHowToPlayDialog } from "./how-to-play-dialog";

const MAX_EQUATIONS = 5;
const MATHINIK_STORAGE_VERSION = 1;
const MATHINIK_STORAGE_PREFIX = "saltong:mathinik";

type StoredMathinikState = {
  version: typeof MATHINIK_STORAGE_VERSION;
  equations: MathinikEquationRow[];
  startedAt: string;
  completedAt: string | null;
};

const createEquation = (): MathinikEquationRow => ({
  id: crypto.randomUUID(),
});

const getMathinikStorageKey = (round: MathinikRound) =>
  [
    MATHINIK_STORAGE_PREFIX,
    round.target,
    round.deck.join(","),
    round.solution.expression,
    round.solution.value,
  ].join(":");

const isStoredSlot = (value: unknown): value is MathinikEquationSlot => {
  if (!value || typeof value !== "object") {
    return false;
  }

  const slot = value as Partial<MathinikEquationSlot>;

  return (
    typeof slot.value === "number" &&
    Number.isFinite(slot.value) &&
    typeof slot.sourceId === "string" &&
    slot.sourceId.length > 0
  );
};

const isStoredOperator = (value: unknown): value is MathinikOperator =>
  MATHINIK_OPERATORS.includes(value as MathinikOperator);

const normalizeStoredMathinikState = (
  value: Partial<StoredMathinikState> | null
): StoredMathinikState | null => {
  if (
    !value ||
    value.version !== MATHINIK_STORAGE_VERSION ||
    !Array.isArray(value.equations)
  ) {
    return null;
  }

  const equations = value.equations
    .slice(0, MAX_EQUATIONS)
    .map((equation): MathinikEquationRow | null => {
      if (!equation || typeof equation.id !== "string") {
        return null;
      }

      return {
        id: equation.id,
        first: isStoredSlot(equation.first) ? equation.first : undefined,
        operator: isStoredOperator(equation.operator)
          ? equation.operator
          : undefined,
        second: isStoredSlot(equation.second) ? equation.second : undefined,
      };
    })
    .filter((equation): equation is MathinikEquationRow => equation !== null);

  if (equations.length === 0) {
    return null;
  }

  return {
    version: MATHINIK_STORAGE_VERSION,
    equations,
    startedAt:
      typeof value.startedAt === "string" && value.startedAt
        ? value.startedAt
        : new Date().toISOString(),
    completedAt:
      typeof value.completedAt === "string" && value.completedAt
        ? value.completedAt
        : null,
  };
};

const EQUATION_VARIABLES = [
  "α",
  "β",
  "γ",
  "δ",
  "ε",
  "ζ",
  "η",
  "θ",
  "ι",
  "κ",
  "λ",
  "μ",
];

function getEquationVariable(index: number) {
  return EQUATION_VARIABLES[index] ?? `v${index + 1}`;
}

function getNextSlot(slot: MathinikSlotKey): MathinikSlotKey {
  if (slot === "first") return "operator";
  if (slot === "operator") return "second";
  return "first";
}

function getPreviousSlot(slot: MathinikSlotKey): MathinikSlotKey {
  if (slot === "second") return "operator";
  if (slot === "operator") return "first";
  return "second";
}

function getSourceLabel(source: MathinikNumberSource) {
  return source.kind === "deck" ? "Given number" : "Result";
}

function getSlotValue(equation: MathinikEquationRow, slot: MathinikSlotKey) {
  if (slot === "operator") return equation.operator;
  return equation[slot];
}

function clearSlot(
  equation: MathinikEquationRow,
  slot: MathinikSlotKey
): MathinikEquationRow {
  return {
    ...equation,
    [slot]: undefined,
  };
}

function isEquationEmpty(equation: MathinikEquationRow) {
  return !equation.first && !equation.operator && !equation.second;
}

export function canDeleteMathinikEquation(
  rowId: string,
  rows: MathinikEquationRow[]
) {
  const row = rows.find((equation) => equation.id === rowId);

  if (!row) {
    return false;
  }

  return (
    !isEquationEmpty(row) ||
    rows.filter((equation) => isEquationEmpty(equation)).length > 1
  );
}

function pruneRowsDependingOn(
  sourceRowIds: Set<string>,
  rows: MathinikEquationRow[]
) {
  const deletedIds = new Set<string>();
  const sourceIds = new Set(sourceRowIds);
  let changed = true;

  while (changed) {
    changed = false;
    const computedSourceIds = [...sourceIds].map((id) => `computed-${id}`);

    for (const equation of rows) {
      if (sourceIds.has(equation.id) || deletedIds.has(equation.id)) continue;

      if (
        (equation.first &&
          computedSourceIds.includes(equation.first.sourceId)) ||
        (equation.second &&
          computedSourceIds.includes(equation.second.sourceId))
      ) {
        sourceIds.add(equation.id);
        deletedIds.add(equation.id);
        changed = true;
      }
    }
  }

  return rows.filter((equation) => !deletedIds.has(equation.id));
}

export function removeMathinikEquationRows(
  rowIds: Set<string>,
  rows: MathinikEquationRow[]
) {
  const remainingRows = pruneRowsDependingOn(rowIds, rows).filter(
    (equation) => !rowIds.has(equation.id)
  );

  if (
    remainingRows.length >= MAX_EQUATIONS ||
    remainingRows.some((equation) => isEquationEmpty(equation))
  ) {
    return remainingRows;
  }

  return [...remainingRows, createEquation()];
}

export default function PlayArea({
  round,
  roundId,
}: {
  round: MathinikRound;
  roundId?: number;
}) {
  const storageKey = getMathinikStorageKey(round);
  const [storedState, setStoredState] =
    useLocalStorage<StoredMathinikState | null>(storageKey, null);
  const initialRow = useMemo(() => createEquation(), []);
  const [equations, setEquations] = useState<MathinikEquationRow[]>([
    initialRow,
  ]);
  const [cursor, setCursor] = useState<MathinikCursor>({
    rowId: initialRow.id,
    slot: "first",
  });
  const [resultsOpen, setResultsOpen] = useState(false);
  const [startedAt, setStartedAt] = useState(() => new Date().toISOString());
  const [completedAt, setCompletedAt] = useState<string | null>(null);
  const [hasLoadedStoredState, setHasLoadedStoredState] = useState(false);
  const exactResultShownRef = useRef(false);

  useEffect(() => {
    if (hasLoadedStoredState) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      const normalizedState = normalizeStoredMathinikState(storedState);

      if (normalizedState) {
        const editableRow =
          normalizedState.equations.find((equation) =>
            isEquationEmpty(equation)
          ) ?? normalizedState.equations[normalizedState.equations.length - 1];

        exactResultShownRef.current = Boolean(normalizedState.completedAt);
        setEquations(normalizedState.equations);
        setStartedAt(normalizedState.startedAt);
        setCompletedAt(normalizedState.completedAt);
        setCursor({ rowId: editableRow.id, slot: "first" });
      }

      setHasLoadedStoredState(true);
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [hasLoadedStoredState, storedState]);

  useEffect(() => {
    if (!hasLoadedStoredState) {
      return;
    }

    setStoredState({
      version: MATHINIK_STORAGE_VERSION,
      equations,
      startedAt,
      completedAt,
    });
  }, [completedAt, equations, hasLoadedStoredState, setStoredState, startedAt]);

  const computedNumbers = useMemo(
    () =>
      equations
        .map((equation, index): MathinikNumberSource | null => {
          const result = getMathinikEquationResult(equation);

          if (result === null) return null;

          return {
            id: `computed-${equation.id}`,
            value: result,
            kind: "computed" as const,
            label: getEquationVariable(index),
          };
        })
        .filter((item): item is MathinikNumberSource => item !== null),
    [equations]
  );

  const availableNumbers = useMemo<MathinikNumberSource[]>(
    () => [
      ...round.deck.map((value, index) => ({
        id: `deck-${index}`,
        value,
        kind: "deck" as const,
      })),
      ...computedNumbers,
    ],
    [computedNumbers, round.deck]
  );

  const usedSourceIds = useMemo(() => {
    const ids = new Set<string>();

    equations.forEach((equation) => {
      if (equation.first?.sourceId) ids.add(equation.first.sourceId);
      if (equation.second?.sourceId) ids.add(equation.second.sourceId);
    });

    return ids;
  }, [equations]);

  const getSlotSourceLabel = (slot?: MathinikEquationRow["first"]) => {
    if (!slot || !slot.sourceId.startsWith("computed-")) {
      return undefined;
    }

    return computedNumbers.find((source) => source.id === slot.sourceId)?.label;
  };

  const bestResult = useMemo<BestResult>(() => {
    const candidates = equations
      .map((equation) => {
        const value = getMathinikEquationResult(equation);
        return value === null ? null : { value, equationId: equation.id };
      })
      .filter((item): item is { value: number; equationId: string } =>
        Boolean(item)
      );

    if (candidates.length === 0) {
      return {
        value: 0,
        difference: round.target,
      };
    }

    return candidates.reduce<BestResult>(
      (best, candidate) => {
        const difference = Math.abs(round.target - candidate.value);

        if (difference < best.difference) {
          return {
            ...candidate,
            difference,
          };
        }

        return best;
      },
      {
        ...candidates[0],
        difference: Math.abs(round.target - candidates[0].value),
      }
    );
  }, [equations, round.target]);

  const solved = bestResult.difference === 0;
  const elapsedText = getDurationString(
    Math.max(
      0,
      new Date(completedAt ?? new Date()).getTime() -
        new Date(startedAt).getTime()
    )
  );

  useEffect(() => {
    if (solved && !exactResultShownRef.current) {
      exactResultShownRef.current = true;
      triggerSuccessConfetti();
      window.setTimeout(() => {
        setCompletedAt(new Date().toISOString());
        setResultsOpen(true);
      }, 0);
    }
  }, [solved]);

  const setCursorToRow = (rowId: string, slot: MathinikSlotKey) => {
    setCursor({ rowId, slot });
  };

  const ensureEditableRow = (rows: MathinikEquationRow[]) => {
    if (rows.length === 0) {
      const row = createEquation();
      return { rows: [row], row };
    }

    return { rows, row: rows[rows.length - 1] };
  };

  const advanceCursor = (
    row: MathinikEquationRow,
    nextSlot: MathinikSlotKey,
    rows: MathinikEquationRow[]
  ) => {
    if (nextSlot !== "first") {
      setCursor({ rowId: row.id, slot: nextSlot });
      return rows;
    }

    const rowError = getMathinikEquationError(row);

    if (rowError) {
      toast.error(rowError);
      setCursor({ rowId: row.id, slot: "second" });
      return rows;
    }

    if (!isMathinikEquationComplete(row)) {
      setCursor({ rowId: row.id, slot: "second" });
      return rows;
    }

    const rowIndex = rows.findIndex((equation) => equation.id === row.id);
    const existingEmptyRow = rows
      .slice(rowIndex + 1)
      .find((equation) => isEquationEmpty(equation));

    if (existingEmptyRow) {
      setCursor({ rowId: existingEmptyRow.id, slot: "first" });
      return rows;
    }

    if (rows.length >= MAX_EQUATIONS) {
      setCursor({ rowId: row.id, slot: "second" });
      return rows;
    }

    const nextRow = createEquation();
    setCursor({ rowId: nextRow.id, slot: "first" });
    return [...rows, nextRow];
  };

  const handleNumberClick = (source: MathinikNumberSource) => {
    if (solved) {
      return;
    }

    if (usedSourceIds.has(source.id)) {
      toast.error("Each number or result can only be used once.");
      return;
    }

    setEquations((previousRows) => {
      const { rows } = ensureEditableRow(previousRows);
      const activeRow =
        rows.find((equation) => equation.id === cursor.rowId) ??
        rows[rows.length - 1];
      const activeRowIndex = rows.findIndex(
        (equation) => equation.id === activeRow.id
      );

      if (source.kind === "computed") {
        const sourceRowId = source.id.replace("computed-", "");
        const sourceRowIndex = rows.findIndex(
          (equation) => equation.id === sourceRowId
        );

        if (sourceRowIndex === -1 || sourceRowIndex >= activeRowIndex) {
          toast.error("Use result numbers only in later equations.");
          return rows;
        }
      }

      const activeSlot =
        cursor.slot === "operator"
          ? activeRow.first
            ? "second"
            : "first"
          : cursor.slot;

      const nextRows = rows.map((equation) =>
        equation.id === activeRow.id
          ? {
              ...equation,
              [activeSlot]: {
                value: source.value,
                sourceId: source.id,
              },
            }
          : equation
      );
      const updatedRow = nextRows.find(
        (equation) => equation.id === activeRow.id
      )!;

      return advanceCursor(
        updatedRow,
        getNextSlot(activeSlot),
        pruneRowsDependingOn(new Set([activeRow.id]), nextRows)
      );
    });
  };

  const handleOperatorClick = (operator: MathinikOperator) => {
    if (solved) {
      return;
    }

    setEquations((previousRows) => {
      const { rows } = ensureEditableRow(previousRows);
      const activeRow =
        rows.find((equation) => equation.id === cursor.rowId) ??
        rows[rows.length - 1];

      if (!activeRow.first) {
        toast.error("Choose a first number before selecting an operator.");
        setCursor({ rowId: activeRow.id, slot: "first" });
        return rows;
      }

      const nextRows = rows.map((equation) =>
        equation.id === activeRow.id ? { ...equation, operator } : equation
      );
      const updatedRow = nextRows.find(
        (equation) => equation.id === activeRow.id
      )!;
      const prunedRows = pruneRowsDependingOn(
        new Set([activeRow.id]),
        nextRows
      );

      if (updatedRow.second) {
        return advanceCursor(updatedRow, "first", prunedRows);
      }

      setCursor({ rowId: activeRow.id, slot: "second" });
      return prunedRows;
    });
  };

  const removeRowsById = (rowIds: Set<string>) => {
    if (solved) {
      return;
    }

    setEquations((previousRows) => {
      if (
        rowIds.size === 1 &&
        !canDeleteMathinikEquation([...rowIds][0], previousRows)
      ) {
        return previousRows;
      }

      const nextRows = removeMathinikEquationRows(rowIds, previousRows);

      if (!nextRows.some((equation) => equation.id === cursor.rowId)) {
        setCursor({ rowId: nextRows[nextRows.length - 1].id, slot: "first" });
      }

      return nextRows;
    });
  };

  const handleDeleteSlot = () => {
    if (solved) {
      return;
    }

    setEquations((previousRows) => {
      const activeRowIndex = previousRows.findIndex(
        (equation) => equation.id === cursor.rowId
      );

      if (activeRowIndex === -1) return previousRows;

      const activeRow = previousRows[activeRowIndex];
      const activeSlotHasValue = Boolean(getSlotValue(activeRow, cursor.slot));
      const targetSlot = activeSlotHasValue
        ? cursor.slot
        : getPreviousSlot(cursor.slot);
      const targetRowIndex =
        !activeSlotHasValue && cursor.slot === "first"
          ? activeRowIndex - 1
          : activeRowIndex;

      if (targetRowIndex < 0) {
        setCursor({ rowId: activeRow.id, slot: "first" });
        return previousRows;
      }

      const targetRow = previousRows[targetRowIndex];
      const nextRows = previousRows.map((equation) =>
        equation.id === targetRow.id
          ? clearSlot(equation, targetSlot)
          : equation
      );
      const prunedRows = pruneRowsDependingOn(
        new Set([targetRow.id]),
        nextRows
      );
      const nextCursor =
        targetSlot === "first" && targetRowIndex > 0
          ? {
              rowId: previousRows[targetRowIndex - 1].id,
              slot: "second" as const,
            }
          : {
              rowId: targetRow.id,
              slot:
                targetSlot === "first"
                  ? ("first" as const)
                  : getPreviousSlot(targetSlot),
            };

      setCursor(nextCursor);
      return prunedRows.length > 0 ? prunedRows : previousRows;
    });
  };

  const handleReset = () => {
    const row = createEquation();
    exactResultShownRef.current = false;
    setStartedAt(new Date().toISOString());
    setCompletedAt(null);
    setEquations([row]);
    setCursor({ rowId: row.id, slot: "first" });
    toast.info("Board reset.");
  };

  const controllerNumberItems = availableNumbers.slice(0, 11);
  const controllerShellClass =
    "border-saltong-teal-700/20 bg-background/78 dark:border-saltong-teal-400/20 rounded-lg border shadow-[0_18px_40px_-30px_rgba(13,148,136,0.5)] backdrop-blur-sm dark:bg-zinc-950/70";
  const controllerButtonClass =
    "border-saltong-teal-700/20 bg-saltong-teal-100 text-saltong-teal-900 hover:bg-saltong-teal-200 focus-visible:ring-saltong-teal-700/30 dark:border-saltong-teal-400/20 dark:bg-saltong-teal-900/45 dark:text-saltong-teal-100 dark:hover:bg-saltong-teal-800/55 rounded-lg border p-0 font-black shadow-none transition-colors disabled:cursor-not-allowed disabled:opacity-45";
  const operatorButtonClass =
    "border-saltong-orange-700/25 bg-saltong-orange-100 text-saltong-orange-900 hover:bg-saltong-orange-200 focus-visible:ring-saltong-orange-700/30 dark:border-saltong-orange-300/25 dark:bg-saltong-orange-900/45 dark:text-saltong-orange-100 dark:hover:bg-saltong-orange-800/60";
  const computedNumberClass =
    "bg-saltong-teal-200 text-saltong-teal-950 hover:bg-saltong-teal-300 dark:bg-saltong-teal-800/65 dark:text-saltong-teal-50 dark:hover:bg-saltong-teal-700/75";
  const placeholderButtonClass =
    "border-saltong-teal-700/20 bg-background/45 text-muted-foreground rounded-lg border-dashed p-0 font-black shadow-none disabled:opacity-40 dark:border-saltong-teal-400/20 dark:bg-zinc-950/35";

  const renderNumberButton = (
    source: MathinikNumberSource,
    className: string
  ) => {
    const used = usedSourceIds.has(source.id);

    return (
      <Button
        key={source.id}
        variant="outline"
        disabled={used || solved}
        title={getSourceLabel(source)}
        className={cn(
          className,
          source.kind === "computed" && computedNumberClass
        )}
        onClick={() => handleNumberClick(source)}
      >
        <span className="relative flex size-full items-center justify-center">
          <NumberValue value={source.value} label={source.label} />
        </span>
      </Button>
    );
  };

  const renderOperatorButton = (
    operator: MathinikOperator,
    className: string
  ) => (
    <Button
      key={operator}
      variant="outline"
      className={className}
      disabled={solved}
      onClick={() => handleOperatorClick(operator)}
    >
      {operator}
    </Button>
  );

  const renderDeleteButton = (className: string, key?: string) => (
    <Button
      key={key}
      variant="outline"
      aria-label="Delete selected slot"
      className={className}
      disabled={solved}
      onClick={handleDeleteSlot}
    >
      <DeleteIcon />
    </Button>
  );

  const renderPlaceholderButton = (key: string, label = "") => (
    <Button
      key={key}
      disabled
      aria-hidden={!label}
      variant="outline"
      className={cn(
        placeholderButtonClass,
        "h-10 sm:h-11 lg:aspect-square lg:h-auto"
      )}
    >
      {label}
    </Button>
  );

  const renderControllerNumberCell = (
    index: number,
    className: string,
    keyPrefix: string
  ) => {
    const source = controllerNumberItems[index];

    if (source) {
      return renderNumberButton(source, className);
    }

    return renderPlaceholderButton(
      `${keyPrefix}-placeholder-${index}`,
      getEquationVariable(
        computedNumbers.length + index - controllerNumberItems.length
      )
    );
  };

  const renderDesktopControllerRow = (
    numberIndexes: number[],
    operator: MathinikOperator
  ) => (
    <>
      {numberIndexes.map((numberIndex) =>
        numberIndex === -1
          ? renderDeleteButton(
              cn(controllerButtonClass, "aspect-square h-auto"),
              "desktop-delete-selected"
            )
          : renderControllerNumberCell(
              numberIndex,
              cn(controllerButtonClass, "aspect-square h-auto text-xl"),
              "desktop"
            )
      )}
      {renderOperatorButton(
        operator,
        cn(
          controllerButtonClass,
          operatorButtonClass,
          "aspect-square h-auto text-2xl"
        )
      )}
    </>
  );

  return (
    <div className="mx-auto flex h-full min-h-0 w-full max-w-6xl flex-col gap-2 overflow-hidden px-2 py-2 sm:gap-3 sm:px-4 sm:py-4 lg:gap-4">
      <MathinikGauge
        target={round.target}
        currentResult={bestResult.equationId ? bestResult : null}
        onReset={handleReset}
        readOnly={solved}
      />

      <div className="grid min-h-0 flex-1 grid-rows-[minmax(0,1fr)_auto] gap-2 overflow-hidden sm:gap-3 lg:grid-cols-[minmax(0,1fr)_21rem] lg:grid-rows-none lg:gap-4">
        <section className="min-h-[12rem] rounded-lg border p-2 shadow-sm backdrop-blur-sm sm:min-h-[16rem] sm:p-3 lg:min-h-0">
          <div className="no-scrollbar h-full min-h-0 overflow-y-auto">
            <div className="flex flex-col gap-2 sm:gap-3">
              {equations.map((equation, index) => {
                const result = getMathinikEquationResult(equation);
                const error = getMathinikEquationError(equation);
                const variable = getEquationVariable(index);

                return (
                  <div
                    key={equation.id}
                    className="bg-background/80 grid grid-cols-[1.5rem_1fr_2.25rem] items-center gap-1.5 rounded-lg border p-2 sm:grid-cols-[2rem_1fr_2.75rem] sm:gap-2 sm:p-3"
                  >
                    <div className="text-muted-foreground text-center text-lg font-black sm:text-xl">
                      {variable}
                    </div>
                    <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2">
                      <SlotButton
                        active={
                          cursor.rowId === equation.id &&
                          cursor.slot === "first"
                        }
                        ariaLabel={`Equation ${variable} first number`}
                        disabled={solved}
                        onClick={() => setCursorToRow(equation.id, "first")}
                      >
                        {equation.first ? (
                          <NumberValue
                            value={equation.first.value}
                            label={getSlotSourceLabel(equation.first)}
                          />
                        ) : (
                          "?"
                        )}
                      </SlotButton>
                      <SlotButton
                        active={
                          cursor.rowId === equation.id &&
                          cursor.slot === "operator"
                        }
                        ariaLabel={`Equation ${variable} operator`}
                        disabled={solved}
                        onClick={() => setCursorToRow(equation.id, "operator")}
                      >
                        {equation.operator ?? "?"}
                      </SlotButton>
                      <SlotButton
                        active={
                          cursor.rowId === equation.id &&
                          cursor.slot === "second"
                        }
                        ariaLabel={`Equation ${variable} second number`}
                        disabled={solved}
                        onClick={() => setCursorToRow(equation.id, "second")}
                        invalid={Boolean(error)}
                      >
                        {equation.second ? (
                          <NumberValue
                            value={equation.second.value}
                            label={getSlotSourceLabel(equation.second)}
                          />
                        ) : (
                          "?"
                        )}
                      </SlotButton>
                      <span className="text-saltong-teal font-black">=</span>
                      <div
                        className={cn(
                          "bg-muted relative flex size-10 items-center justify-center rounded-lg border-2 text-base font-black sm:size-14 sm:text-lg",
                          error
                            ? "border-destructive text-destructive"
                            : "border-saltong-teal-700/25"
                        )}
                      >
                        {error ? (
                          "!"
                        ) : result === null ? (
                          "?"
                        ) : (
                          <NumberValue value={result} label={variable} />
                        )}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label={`Delete equation ${variable}`}
                      disabled={
                        solved ||
                        !canDeleteMathinikEquation(equation.id, equations)
                      }
                      onClick={() => removeRowsById(new Set([equation.id]))}
                    >
                      <Trash2Icon />
                    </Button>
                    {error && (
                      <div className="text-destructive col-span-3 px-7 text-xs font-semibold">
                        {error}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section
          aria-label="Mathinik calculator"
          className={cn(controllerShellClass, "h-fit p-1.5 sm:p-2 lg:hidden")}
        >
          <div className="grid grid-cols-6 gap-1.5 sm:gap-2">
            {MATHINIK_OPERATORS.map((operator) =>
              renderOperatorButton(
                operator,
                cn(
                  controllerButtonClass,
                  operatorButtonClass,
                  "h-10 min-h-0 text-lg sm:h-11"
                )
              )
            )}
            {renderPlaceholderButton("mobile-top-placeholder")}
            {renderDeleteButton(
              cn(controllerButtonClass, "h-10 min-h-0 sm:h-11")
            )}

            {controllerNumberItems.map((source) =>
              renderNumberButton(
                source,
                cn(controllerButtonClass, "h-10 text-lg sm:h-11 sm:text-xl")
              )
            )}
            {Array.from({
              length: Math.max(0, 11 - controllerNumberItems.length),
            }).map((_, index) =>
              renderPlaceholderButton(
                `mobile-placeholder-${index}`,
                getEquationVariable(computedNumbers.length + index)
              )
            )}
          </div>

          {solved && (
            <Button
              size="lg"
              className="mx-auto mt-2 w-full max-w-sm font-bold"
              onClick={() => setResultsOpen(true)}
            >
              <TrophyIcon />
              View Results
            </Button>
          )}
        </section>

        <section
          aria-label="Mathinik calculator"
          className={cn(controllerShellClass, "hidden h-fit p-3 lg:block")}
        >
          <div className="grid grid-cols-4 gap-2">
            {renderDesktopControllerRow([0, 1, 2], MATHINIK_OPERATORS[0])}
            {renderDesktopControllerRow([3, 4, 5], MATHINIK_OPERATORS[1])}
            {renderDesktopControllerRow([6, 7, 8], MATHINIK_OPERATORS[2])}
            {renderDesktopControllerRow([9, 10, -1], MATHINIK_OPERATORS[3])}
          </div>

          {solved && (
            <Button
              size="lg"
              className="mx-auto mt-4 w-full max-w-sm font-bold lg:col-span-2 lg:max-w-lg"
              onClick={() => setResultsOpen(true)}
            >
              <TrophyIcon />
              View Results
            </Button>
          )}
        </section>
      </div>

      <MathinikResultsSheet
        open={resultsOpen}
        onOpenChange={setResultsOpen}
        round={round}
        roundId={roundId}
        equations={equations}
        bestResult={bestResult}
        startedAt={startedAt}
        completedAt={completedAt}
        elapsedText={elapsedText}
      />
    </div>
  );
}
