"use client";

import { cn } from "@/lib/utils";
import HexGrid from "@/features/hex/components/hex-grid";
import { HEX_HOW_TO_PLAY_COPY } from "@/features/hex/how-to-play-copy";

export function HexWordCells({
  word,
  centerLetter,
  pointsLabel,
}: {
  word: string;
  centerLetter: string;
  pointsLabel: string;
}) {
  return (
    <div
      className="flex flex-wrap items-center gap-2"
      aria-label={`${word} example`}
    >
      <div className="flex gap-1.5">
        {word.split("").map((letter, index) => (
          <div
            key={`${letter}-${index}`}
            className={cn(
              "bg-saltong-purple-200 dark:bg-saltong-purple/30 flex size-8 items-center justify-center rounded-md sm:size-9",
              letter.toUpperCase() === centerLetter.toUpperCase() &&
                "bg-saltong-purple dark:bg-saltong-purple"
            )}
          >
            <span className="text-lg font-bold select-none sm:text-xl">
              {letter}
            </span>
          </div>
        ))}
      </div>
      <span className="text-saltong-purple text-sm font-bold">
        = {pointsLabel}
      </span>
    </div>
  );
}

export function HexGuideVisual() {
  const centerLetter = HEX_HOW_TO_PLAY_COPY.example.centerLetter;

  return (
    <div className="space-y-6">
      <HexGrid
        letters={["K", "T", "R", "E", "S", "P"]}
        centerLetter={centerLetter}
        onClick={() => {}}
      />
      <div className="border-t pt-4">
        <h2 className="text-base font-semibold">Example words</h2>
        <div className="mt-3 space-y-3">
          {HEX_HOW_TO_PLAY_COPY.example.entries.map((entry) => (
            <div key={entry.word}>
              <HexWordCells
                word={entry.word}
                centerLetter={centerLetter}
                pointsLabel={entry.pointsLabel}
              />
              <p className="text-muted-foreground mt-1 text-sm leading-relaxed">
                {entry.guideDescription}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
