import { DATE_FORMAT, getFormattedDateInPh } from "@/utils/time";
import { differenceInDays, parse } from "date-fns";
import { MATHINIK_CONFIG } from "./config";

export const MATHINIK_OPERATORS = ["÷", "×", "-", "+"] as const;

export type MathinikOperator = (typeof MATHINIK_OPERATORS)[number];

export type MathinikNumberSource = {
  id: string;
  value: number;
  kind: "deck" | "computed";
  label?: string;
};

export type MathinikEquationSlot = {
  value: number;
  sourceId: string;
};

export type MathinikEquationRow = {
  id: string;
  first?: MathinikEquationSlot;
  operator?: MathinikOperator;
  second?: MathinikEquationSlot;
};

export type MathinikSlotKey = "first" | "operator" | "second";

export type MathinikCursor = {
  rowId: string;
  slot: MathinikSlotKey;
};

export type MathinikScoreBand =
  | "Perfect"
  | "Excellent"
  | "Good"
  | "Keep Trying";

export const MATHINIK_RANKS = [
  { name: "bathala", minDifference: 0, maxDifference: 0, icon: "⚡" },
  { name: "alamat", minDifference: 1, maxDifference: 5, icon: "👑" },
  { name: "bihasa", minDifference: 6, maxDifference: 10, icon: "🎓" },
  { name: "sakto", minDifference: 11, maxDifference: 25, icon: "🌱" },
  {
    name: "bagito",
    minDifference: 26,
    maxDifference: Infinity,
    icon: "👶",
  },
] as const;

export function getMathinikGameDate(date?: string) {
  return date ?? getFormattedDateInPh();
}

export function getMathinikRoundIdFromDate(date: string) {
  const targetDate = parse(date, DATE_FORMAT, new Date());
  const startDate = parse(MATHINIK_CONFIG.startDate, DATE_FORMAT, new Date());

  return differenceInDays(targetDate, startDate) + 1;
}

export function isMathinikDateBeforeStart(date: string) {
  return getMathinikRoundIdFromDate(date) < 1;
}

export function solveMathinikOperation(
  num1: number,
  operator: MathinikOperator,
  num2: number
): number {
  let result: number;

  switch (operator) {
    case "+":
      result = num1 + num2;
      break;
    case "-":
      result = num1 - num2;
      break;
    case "×":
      result = num1 * num2;
      break;
    case "÷":
      if (num2 === 0) {
        throw new Error("Cannot divide by zero.");
      }

      if (num1 % num2 !== 0) {
        throw new Error("Division must result in a whole number.");
      }

      result = num1 / num2;
      break;
  }

  if (result <= 0) {
    throw new Error("Result must be a positive whole number.");
  }

  return result;
}

export function isMathinikEquationComplete(equation: MathinikEquationRow) {
  return Boolean(equation.first && equation.operator && equation.second);
}

export function getMathinikEquationResult(equation: MathinikEquationRow) {
  if (!isMathinikEquationComplete(equation)) {
    return null;
  }

  try {
    return solveMathinikOperation(
      equation.first!.value,
      equation.operator!,
      equation.second!.value
    );
  } catch {
    return null;
  }
}

export function getMathinikEquationError(equation: MathinikEquationRow) {
  if (!isMathinikEquationComplete(equation)) {
    return null;
  }

  try {
    solveMathinikOperation(
      equation.first!.value,
      equation.operator!,
      equation.second!.value
    );
    return null;
  } catch (error) {
    return error instanceof Error ? error.message : "Invalid equation.";
  }
}

export function getMathinikScoreBand(difference: number): MathinikScoreBand {
  if (difference === 0) return "Perfect";
  if (difference <= 5) return "Excellent";
  if (difference <= 10) return "Good";
  return "Keep Trying";
}

export function getMathinikRank(difference: number) {
  return (
    MATHINIK_RANKS.find(
      (rank) =>
        difference >= rank.minDifference && difference <= rank.maxDifference
    ) ?? MATHINIK_RANKS[MATHINIK_RANKS.length - 1]
  );
}

export function getMathinikScoreTone(difference: number) {
  if (difference === 0)
    return "text-saltong-green-700 dark:text-saltong-green-200";
  if (difference <= 5) return "text-saltong-teal dark:text-saltong-teal-200";
  if (difference <= 10)
    return "text-saltong-orange dark:text-saltong-orange-200";
  return "text-muted-foreground";
}

export function getMathinikEquationText(equation: MathinikEquationRow) {
  const result = getMathinikEquationResult(equation);

  return [
    equation.first?.value ?? "?",
    equation.operator ?? "?",
    equation.second?.value ?? "?",
    result === null ? "" : `= ${result}`,
  ]
    .filter(Boolean)
    .join(" ");
}
