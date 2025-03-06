"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { LetterStatus } from "../types";

const KEYBOARD_LAYOUT = [
  ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"],
  ["#0", "a", "s", "d", "f", "g", "h", "j", "k", "l", "#1"],
  ["Enter", "z", "x", "c", "v", "b", "n", "m", "Backspace"],
] as const;

export default function Keyboard({
  status,
  onKeyClick,
  disabled,
}: {
  status: Record<string, string>;
  onKeyClick: (obj: { key: string }) => void;
  disabled?: boolean;
}) {
  return (
    <div className="bg-background/20 sticky bottom-0 flex w-full items-center justify-center px-1.5 py-2 backdrop-blur-md md:py-4">
      <div className="flex w-full max-w-[500px] flex-col gap-2">
        {KEYBOARD_LAYOUT.map((row, i) => (
          <div key={i} className="flex justify-center gap-1">
            {row.map((key, j) =>
              key.startsWith("#") ? (
                <div key={key} className="grow" />
              ) : (
                <Button
                  key={j}
                  variant="secondary"
                  className={cn(
                    "h-[58px] max-w-[43px] flex-1 flex-grow-2 p-0 text-xl font-black text-black/70 select-none dark:text-white/70",
                    {
                      "max-w-[64px] flex-grow-3":
                        key === "Enter" || key === "Backspace",
                      "bg-slate-300 dark:bg-slate-600":
                        status?.[key] === LetterStatus.Incorrect,
                      "bg-orange-500 dark:bg-orange-600":
                        status?.[key] === LetterStatus.Partial,
                      "bg-green-500 dark:bg-green-700":
                        status?.[key] === LetterStatus.Correct,
                    }
                  )}
                  onClick={(e) => {
                    e.preventDefault();
                    onKeyClick({ key });
                  }}
                  disabled={disabled}
                >
                  {key === "Enter"
                    ? "↵"
                    : key === "Backspace"
                      ? "⌫"
                      : key.toUpperCase()}
                </Button>
              )
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
