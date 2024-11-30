"use client";

import { cn } from "@/lib/utils";
import { useMemo } from "react";
import { LetterStatus } from "../types";
import { Skeleton } from "@/components/ui/skeleton";

export default function SaltongGrid({
  maxTries,
  wordLen,
  grid = "",
  inputData = "",
  status = "",
  disabled,
  isLoading,
}: {
  maxTries: number;
  wordLen: number;
  grid?: string;
  status?: string;
  inputData?: string;
  disabled?: boolean;
  isLoading?: boolean;
}) {
  const currTurn = useMemo(() => grid.length / wordLen, [grid, wordLen]);

  return (
    <div>
      <div className="flex flex-col gap-2">
        {Array.from({ length: maxTries }, (_, i) => (
          <div className="flex gap-2" key={i}>
            {Array.from({ length: wordLen }, (_, j) =>
              isLoading ? (
                <Skeleton
                  key={`${i}-${j}`}
                  className="size-[35px] rounded-lg md:size-[45px]"
                />
              ) : (
                <div
                  key={`${i}-${j}`}
                  className="relative size-[35px] overflow-hidden rounded-lg bg-muted md:size-[45px]"
                >
                  <div
                    className={cn(
                      "absolute inset-0 flex size-[35px] translate-y-[-35px] items-center justify-center bg-destructive transition-transform duration-200 ease-in-out-expo md:size-[45px] md:translate-y-[-45px]",
                      {
                        "translate-y-0 md:translate-y-0":
                          !!status?.[i * wordLen + j],
                        "bg-slate-300 dark:bg-slate-600":
                          status?.[i * wordLen + j] === LetterStatus.Incorrect,
                        "bg-orange-500 dark:bg-orange-600":
                          status?.[i * wordLen + j] === LetterStatus.Partial,
                        "inverted-colors:bg-blue-500 bg-green-500 dark:bg-green-700":
                          status?.[i * wordLen + j] === LetterStatus.Correct,
                      }
                    )}
                  />

                  {!disabled && (
                    <div
                      className={cn(
                        "absolute inset-0 flex size-[35px] translate-y-[-35px] items-center justify-center bg-blue-400 transition-transform duration-200 ease-in-out-expo md:size-[45px] md:translate-y-[-45px]",
                        {
                          "delay-[20ms] translate-y-0 md:translate-y-0":
                            currTurn === i,
                          "translate-y-[35px] md:translate-y-[45px]":
                            i < currTurn,
                        }
                      )}
                    />
                  )}

                  <div className="absolute flex size-[35px] items-center justify-center md:size-[45px]">
                    <p className="select-none text-2xl font-bold uppercase opacity-70 md:text-3xl">
                      {(currTurn === i
                        ? inputData?.[j]
                        : grid?.[wordLen * i + j]) ?? ""}
                    </p>
                  </div>
                </div>
              )
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
