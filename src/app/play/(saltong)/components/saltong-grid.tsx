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
                  className="bg-muted relative size-[35px] overflow-hidden rounded-lg md:size-[45px]"
                >
                  <div
                    className={cn(
                      "bg-destructive ease-in-out-expo absolute inset-0 flex size-[35px] translate-y-[-35px] items-center justify-center transition-transform duration-200 md:size-[45px] md:translate-y-[-45px]",
                      {
                        "translate-y-0 md:translate-y-0":
                          !!status?.[i * wordLen + j],
                        "bg-cell-incorrect inverted-colors:bg-slate-800":
                          status?.[i * wordLen + j] === LetterStatus.Incorrect,
                        "bg-cell-partial inverted-colors:bg-yellow-500":
                          status?.[i * wordLen + j] === LetterStatus.Partial,
                        "bg-cell-correct inverted-colors:bg-blue-500":
                          status?.[i * wordLen + j] === LetterStatus.Correct,
                      }
                    )}
                  />

                  {!disabled && (
                    <div
                      className={cn(
                        "ease-in-out-expo absolute inset-0 flex size-[35px] translate-y-[-35px] items-center justify-center bg-blue-400 transition-transform duration-200 md:size-[45px] md:translate-y-[-45px]",
                        {
                          "translate-y-0 delay-[20ms] md:translate-y-0":
                            currTurn === i,
                          "translate-y-[35px] md:translate-y-[45px]":
                            i < currTurn,
                        }
                      )}
                    />
                  )}

                  <div className="absolute flex size-[35px] items-center justify-center md:size-[45px]">
                    <p className="text-cell-primary-foreground text-2xl font-bold uppercase select-none md:text-3xl">
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
