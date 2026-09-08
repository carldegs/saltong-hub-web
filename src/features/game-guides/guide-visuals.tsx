import { cn } from "@/lib/utils";
import { LetterStatus } from "@/features/saltong/types";
import {
  MathinikStaticBox,
  MathinikTargetPentagon,
  NumberValue,
} from "@/features/mathinik/components/mathinik-display";

const STATUS_CLASSES = {
  [LetterStatus.Correct]: "bg-cell-correct",
  [LetterStatus.Partial]: "bg-cell-partial",
  [LetterStatus.Incorrect]: "bg-cell-incorrect",
  [LetterStatus.Empty]: "bg-muted",
} as const;

export function SaltongExampleTiles({
  word,
  statuses,
}: {
  word: string;
  statuses: readonly LetterStatus[];
}) {
  return (
    <div className="flex flex-wrap gap-2" aria-label={`${word} example`}>
      {word.split("").map((letter, index) => (
        <div
          key={`${letter}-${index}`}
          className={cn(
            "flex size-10 items-center justify-center rounded-lg text-lg font-bold text-white shadow-sm sm:size-12 sm:text-xl",
            STATUS_CLASSES[statuses[index]]
          )}
        >
          {letter}
        </div>
      ))}
    </div>
  );
}

export function HexLetterBoard() {
  return (
    <div className="flex flex-col items-center" aria-label="Hex letter board">
      <div className="-mb-4 flex gap-1.5 sm:-mb-5 sm:gap-2">
        <HexTile letter="K" />
        <HexTile letter="T" />
      </div>
      <div className="flex gap-1.5 sm:gap-2">
        <HexTile letter="R" />
        <HexTile letter="O" center />
        <HexTile letter="E" />
      </div>
      <div className="-mt-4 flex gap-1.5 sm:-mt-5 sm:gap-2">
        <HexTile letter="S" />
        <HexTile letter="P" />
      </div>
    </div>
  );
}

function HexTile({
  letter,
  center = false,
}: {
  letter: string;
  center?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex size-16 items-center justify-center text-xl font-bold shadow-sm [clip-path:polygon(25%_6%,75%_6%,100%_50%,75%_94%,25%_94%,0_50%)] sm:size-20 sm:text-2xl",
        center
          ? "bg-saltong-purple text-saltong-purple-100"
          : "bg-saltong-purple-200 text-saltong-purple-900 dark:bg-saltong-purple/35 dark:text-saltong-purple-100"
      )}
    >
      {letter}
    </div>
  );
}

export function SudokuExampleBoard() {
  const values = [
    [5, 3, 4, 6, 7, 8, 9, 1, 2],
    [6, 7, 2, 1, 9, 5, 3, 4, 8],
    [1, 9, 8, 3, 4, 2, 5, 6, 7],
    [8, 5, 9, 7, 6, 1, 4, 2, 3],
    [4, 2, 6, 8, 5, 3, 7, 9, 1],
    [7, 1, 3, 9, 2, 4, 8, 5, 6],
    [9, 6, 1, 5, 3, 7, 2, 8, 4],
    [2, 8, 7, 4, 1, 9, 6, 3, 5],
    [3, 4, 5, 2, 8, 6, 1, 7, 9],
  ];

  return (
    <div className="border-primary bg-background grid aspect-square w-full max-w-sm grid-cols-9 overflow-hidden rounded-md border-2 shadow-sm">
      {values.flatMap((row, rowIndex) =>
        row.map((value, columnIndex) => (
          <div
            key={`${rowIndex}-${columnIndex}`}
            className={cn(
              "border-primary/35 flex aspect-square items-center justify-center border text-sm font-black sm:text-base",
              (columnIndex === 2 || columnIndex === 5) && "border-r-2",
              (rowIndex === 2 || rowIndex === 5) && "border-b-2"
            )}
          >
            {value}
          </div>
        ))
      )}
    </div>
  );
}

export function MathinikExampleBoard() {
  return (
    <div className="bg-background/60 space-y-4 rounded-xl border p-4 shadow-sm">
      <div className="flex flex-wrap items-center justify-center gap-2">
        {[1, 3, 5, 9, 10, 50].map((value) => (
          <MathinikStaticBox key={value}>
            <NumberValue value={value} />
          </MathinikStaticBox>
        ))}
        <MathinikTargetPentagon target={898} className="h-12 w-20" />
      </div>
    </div>
  );
}
