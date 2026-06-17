"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { SettingsIcon, Undo2Icon, XIcon } from "lucide-react";
import { MouseEvent } from "react";
import { SudokuInputMode } from "../types";

const NUMBER_BUTTONS = [
  { value: 1, className: "order-1 lg:order-1" },
  { value: 2, className: "order-2 lg:order-2" },
  { value: 3, className: "order-3 lg:order-3" },
  { value: 4, className: "order-5 lg:order-4" },
  { value: 5, className: "order-6 lg:order-5" },
  { value: 6, className: "order-7 lg:order-6" },
  { value: 7, className: "order-9 lg:order-7" },
  { value: 8, className: "order-10 lg:order-8" },
  { value: 9, className: "order-11 lg:order-9" },
] as const;

const CONTROL_BUTTONS = [
  {
    key: "clear",
    label: "Clear",
    className: "order-4 lg:order-10",
    icon: XIcon,
  },
  {
    key: "undo",
    label: "Undo",
    className: "order-8 lg:order-11",
    icon: Undo2Icon,
  },
  {
    key: "settings",
    label: "Settings",
    className: "order-12 lg:order-12",
    icon: SettingsIcon,
  },
] as const;

function ModeButton({
  active,
  children,
  onClick,
}: {
  active: boolean;
  children: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      className={cn(
        "focus-visible:ring-saltong-orange-500/45 flex h-9 items-center justify-center rounded-md border px-2 text-sm font-bold transition-colors focus-visible:ring-3 focus-visible:outline-none sm:text-base lg:h-10",
        active
          ? "border-saltong-orange-600 bg-saltong-orange-600 dark:border-saltong-orange-500 dark:bg-saltong-orange-500 dark:text-saltong-orange-950 text-white shadow-xs"
          : "border-saltong-orange-700/25 bg-background/70 text-saltong-orange-700 hover:bg-saltong-orange-50 dark:border-saltong-orange-400/25 dark:text-saltong-orange-200 dark:hover:bg-saltong-orange-950/35 dark:bg-zinc-950/45"
      )}
      onMouseDown={preventGridBlur}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

function preventGridBlur(event: MouseEvent<HTMLButtonElement>) {
  event.preventDefault();
}

export default function SudokuController({
  inputMode,
  onInputModeChange,
  onNumberClick,
  onClear,
  onUndo,
  autoCandidates,
  onAutoCandidatesChange,
  autoCheck,
  onAutoCheckChange,
  onFillCellCandidates,
  onFillAllCandidates,
  onCheckCell,
  onCheckGrid,
  onDeleteCandidates,
  onClearGrid,
  className,
}: {
  inputMode: SudokuInputMode;
  onInputModeChange: (inputMode: SudokuInputMode) => void;
  onNumberClick: (value: number) => void;
  onClear: () => void;
  onUndo: () => void;
  autoCandidates: boolean;
  onAutoCandidatesChange: (autoCandidates: boolean) => void;
  autoCheck: boolean;
  onAutoCheckChange: (autoCheck: boolean) => void;
  onFillCellCandidates: () => void;
  onFillAllCandidates: () => void;
  onCheckCell: () => void;
  onCheckGrid: () => void;
  onDeleteCandidates: () => void;
  onClearGrid: () => void;
  className?: string;
}) {
  const isCandidateMode = inputMode === "candidates";

  return (
    <section
      aria-label="Sudoku controller"
      className={cn(
        "border-saltong-orange-700/20 bg-background/78 dark:border-saltong-orange-400/20 mx-auto rounded-lg border p-2 shadow-[0_18px_40px_-30px_rgba(146,64,14,0.5)] backdrop-blur-sm sm:p-3 lg:w-[17rem] lg:p-4 xl:w-[18.5rem] dark:bg-zinc-950/70",
        className
      )}
    >
      <div
        role="tablist"
        aria-label="Input mode"
        className="mx-auto grid w-[12.125rem] grid-cols-2 gap-1.5 sm:w-[13.5rem] sm:gap-2 lg:w-full lg:gap-3"
      >
        <ModeButton
          active={inputMode === "solution"}
          onClick={() => onInputModeChange("solution")}
        >
          Solution
        </ModeButton>
        <ModeButton
          active={isCandidateMode}
          onClick={() => onInputModeChange("candidates")}
        >
          Notes
        </ModeButton>
      </div>

      <div className="mt-2 grid [grid-template-columns:repeat(4,2.75rem)] justify-center gap-1.5 sm:mt-3 sm:[grid-template-columns:repeat(4,3rem)] sm:gap-2 lg:mt-4 lg:grid-cols-3 lg:gap-2.5">
        {NUMBER_BUTTONS.map(({ value, className }) => (
          <Button
            key={value}
            type="button"
            aria-label={`Enter ${value}`}
            className={cn(
              "border-saltong-orange-700/20 bg-saltong-orange-100 text-saltong-orange-800 hover:bg-saltong-orange-200 focus-visible:ring-saltong-orange-700/30 dark:border-saltong-orange-400/20 dark:bg-saltong-orange-900/45 dark:text-saltong-orange-100 dark:hover:bg-saltong-orange-800/55 size-11 rounded-lg border p-0 font-black shadow-none transition-colors sm:size-12 lg:aspect-square lg:size-auto",
              "text-2xl sm:text-3xl lg:text-3xl xl:text-4xl",
              className
            )}
            onMouseDown={preventGridBlur}
            onClick={() => onNumberClick(value)}
          >
            {
              <span
                className={cn({
                  "font-[family-name:var(--font-handwriting)]": isCandidateMode,
                })}
              >
                {value}
              </span>
            }
          </Button>
        ))}

        {CONTROL_BUTTONS.map(({ key, label, className, icon: Icon }) => {
          if (key === "settings") {
            return (
              <DropdownMenu key={key}>
                <DropdownMenuTrigger asChild>
                  <Button
                    type="button"
                    aria-label={label}
                    className={cn(
                      "border-saltong-orange-700/20 bg-saltong-orange-100 text-saltong-orange-800 hover:bg-saltong-orange-200 focus-visible:ring-saltong-orange-700/30 dark:border-saltong-orange-400/20 dark:bg-saltong-orange-900/45 dark:text-saltong-orange-100 dark:hover:bg-saltong-orange-800/55 size-11 rounded-lg border p-0 shadow-none transition-colors sm:size-12 lg:aspect-square lg:size-auto",
                      className
                    )}
                    onMouseDown={preventGridBlur}
                  >
                    <Icon className="size-5 stroke-[2.5] sm:size-6 lg:size-7 xl:size-8" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  side="top"
                  className="min-w-52"
                >
                  <DropdownMenuItem onClick={onFillCellCandidates}>
                    Fill Cell Candidate
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={onFillAllCandidates}>
                    Fill Grid Candidates
                  </DropdownMenuItem>
                  <DropdownMenuCheckboxItem
                    checked={autoCandidates}
                    onCheckedChange={(checked) =>
                      onAutoCandidatesChange(checked === true)
                    }
                  >
                    Auto-Candidates
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={autoCheck}
                    onCheckedChange={(checked) =>
                      onAutoCheckChange(checked === true)
                    }
                  >
                    Auto-Check
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={onCheckCell}>
                    Check Cell
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={onCheckGrid}>
                    Check Grid
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={onDeleteCandidates}>
                    Delete Candidates
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="text-destructive focus:bg-destructive/10 focus:text-destructive dark:focus:bg-destructive/20 dark:focus:text-red-300"
                    onClick={onClearGrid}
                  >
                    Clear Grid
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            );
          }

          const handleClick =
            key === "clear" ? onClear : key === "undo" ? onUndo : undefined;

          return (
            <Button
              key={key}
              type="button"
              aria-label={label}
              className={cn(
                "border-saltong-orange-700/20 bg-saltong-orange-100 text-saltong-orange-800 hover:bg-saltong-orange-200 focus-visible:ring-saltong-orange-700/30 dark:border-saltong-orange-400/20 dark:bg-saltong-orange-900/45 dark:text-saltong-orange-100 dark:hover:bg-saltong-orange-800/55 size-11 rounded-lg border p-0 shadow-none transition-colors sm:size-12 lg:aspect-square lg:size-auto",
                className
              )}
              onMouseDown={preventGridBlur}
              onClick={() => handleClick?.()}
            >
              <Icon className="size-5 stroke-[2.5] sm:size-6 lg:size-7 xl:size-8" />
            </Button>
          );
        })}
      </div>
    </section>
  );
}
