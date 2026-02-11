"use client";

import { cn } from "@/lib/utils";
import { RefObject, useMemo, useRef, useState } from "react";
import { LetterStatus } from "../types";
import { Skeleton } from "@/components/ui/skeleton";
import CustomLoader from "@/components/shared/custom-loader";
import { useDebounceCallback, useResizeObserver } from "usehooks-ts";

const MIN_CELL_SIZE = 35;
const MAX_CELL_SIZE = 55;

export default function SaltongGrid({
  maxTries,
  wordLen,
  grid = "",
  inputData = "",
  status = "",
  disabled,
  isLoading,
  loaderType = "default",
}: {
  maxTries: number;
  wordLen: number;
  grid?: string;
  status?: string;
  inputData?: string;
  disabled?: boolean;
  isLoading?: boolean;
  loaderType?: "none" | "skeleton" | "default";
}) {
  const currTurn = useMemo(() => grid.length / wordLen, [grid, wordLen]);
  const containerRef = useRef<HTMLDivElement>(null);
  const [cellSize, setCellSize] = useState<number>(MIN_CELL_SIZE);
  const [fontSize, setFontSize] = useState<string>("2xl");
  const [isInitialized, setIsInitialized] = useState<boolean>(false);

  const cellSizeWithOffset = cellSize + 8;

  const onResize = useDebounceCallback(
    (size: { width: number; height: number }) => {
      setIsInitialized(true);
      const gap = 8; // matches gap-2 (0.5rem)
      const paddingPerSide = 16;
      const width = size.width ?? 0;
      const height = size.height ?? 0;

      if (width === 0 || height === 0 || maxTries === 0 || wordLen === 0) {
        setCellSize(MIN_CELL_SIZE);
        return;
      }

      const availableWidth = Math.max(
        width - paddingPerSide * 2 - gap * (wordLen - 1),
        0
      );
      const availableHeight = Math.max(
        height - paddingPerSide * 2 - gap * (maxTries - 1),
        0
      );

      const sizeFromWidth = availableWidth / wordLen;
      const sizeFromHeight = availableHeight / maxTries;
      const candidate = Math.min(sizeFromWidth, sizeFromHeight);

      const computed = Math.floor(
        Math.max(MIN_CELL_SIZE, Math.min(MAX_CELL_SIZE, candidate))
      );

      setCellSize(computed);

      // font size

      if (computed >= 50) {
        setFontSize("4xl");
      } else if (computed >= 40) {
        setFontSize("3xl");
      } else {
        setFontSize("2xl");
      }
    },
    200
  );

  useResizeObserver({
    ref: containerRef as RefObject<HTMLElement>,
    onResize: (size) => {
      onResize({
        width: size.width ?? 0,
        height: size.height ?? 0,
      });
    },
  });

  return (
    <div
      id="saltong-grid"
      className="flex h-full w-full flex-col items-center justify-center gap-2"
      ref={containerRef}
    >
      {isInitialized && !isLoading ? (
        Array.from({ length: maxTries }, (_, i) => (
          <div className="flex gap-2" key={i}>
            {Array.from({ length: wordLen }, (_, j) =>
              isLoading ? (
                <Skeleton
                  key={`${i}-${j}`}
                  className="rounded-lg"
                  style={{ width: cellSize, height: cellSize }}
                />
              ) : (
                <div
                  key={`${i}-${j}`}
                  className="bg-muted relative overflow-hidden rounded-lg"
                  style={{ width: cellSize, height: cellSize }}
                >
                  <div
                    className={cn(
                      "bg-destructive ease-in-out-expo absolute inset-0 flex items-center justify-center transition-transform duration-200",
                      {
                        "translate-y-0": !!status?.[i * wordLen + j],
                        "bg-cell-incorrect inverted-colors:bg-slate-800":
                          status?.[i * wordLen + j] === LetterStatus.Incorrect,
                        "bg-cell-partial inverted-colors:bg-yellow-500":
                          status?.[i * wordLen + j] === LetterStatus.Partial,
                        "bg-cell-correct inverted-colors:bg-blue-500":
                          status?.[i * wordLen + j] === LetterStatus.Correct,
                      }
                    )}
                    style={{
                      width: cellSize,
                      height: cellSize,
                      transform: !!status?.[i * wordLen + j]
                        ? "translateY(0)"
                        : `translateY(-${cellSizeWithOffset}px)`,
                    }}
                  />

                  {!disabled && (
                    <div
                      className={cn(
                        "ease-in-out-expo absolute inset-0 flex items-center justify-center bg-blue-400 transition-transform duration-200",
                        {
                          "translate-y-0 delay-[20ms]": currTurn === i,
                        }
                      )}
                      style={{
                        width: cellSize,
                        height: cellSize,
                        transform:
                          currTurn === i
                            ? "translateY(0)"
                            : i < currTurn
                              ? `translateY(${cellSizeWithOffset}px)`
                              : `translateY(-${cellSizeWithOffset}px)`,
                      }}
                    />
                  )}

                  <div
                    className="absolute flex items-center justify-center"
                    style={{ width: cellSize, height: cellSize }}
                  >
                    <p
                      className={cn(
                        "text-cell-primary-foreground font-bold uppercase select-none",
                        {
                          "text-2xl": fontSize === "2xl",
                          "text-3xl": fontSize === "3xl",
                          "text-4xl": fontSize === "4xl",
                        }
                      )}
                    >
                      {(currTurn === i
                        ? inputData?.[j]
                        : grid?.[wordLen * i + j]) ?? ""}
                    </p>
                  </div>
                </div>
              )
            )}
          </div>
        ))
      ) : loaderType === "default" ? (
        <CustomLoader />
      ) : loaderType === "skeleton" ? (
        <div className="flex items-center justify-center gap-4">
          {Array.from({ length: wordLen }).map((_, j) => (
            <Skeleton key={j} className="size-9" />
          ))}
        </div>
      ) : null}
    </div>
  );
}
