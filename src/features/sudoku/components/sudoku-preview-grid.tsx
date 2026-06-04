import { cn } from "@/lib/utils";

export default function SudokuPreviewGrid({ puzzle }: { puzzle: number[] }) {
  return (
    <div className="border-saltong-orange-800/70 dark:border-saltong-orange-700/40 bg-background mx-auto grid w-full max-w-[34rem] grid-cols-9 overflow-hidden rounded-2xl border shadow-[0_18px_40px_-28px_rgba(146,64,14,0.45)] dark:bg-zinc-950">
      {puzzle.map((value, index) => {
        const row = Math.floor(index / 9);
        const col = index % 9;
        const isBlank = value === 0;

        return (
          <div
            key={`${row}-${col}`}
            className={cn(
              "flex aspect-square items-center justify-center border text-lg font-semibold sm:text-xl",
              "border-saltong-orange-700/70 dark:border-saltong-orange-700/35",
              isBlank
                ? "bg-saltong-orange-50 text-saltong-orange-300 dark:bg-saltong-orange-950/55 dark:text-saltong-orange-700"
                : "bg-background text-foreground dark:bg-zinc-950 dark:text-zinc-50",
              row % 3 === 0 && "border-t-saltong-orange-700 border-t-2",
              col % 3 === 0 && "border-l-saltong-orange-700 border-l-2",
              row === 8 && "border-b-saltong-orange-700 border-b-2",
              col === 8 && "border-r-saltong-orange-700 border-r-2"
            )}
          >
            {isBlank ? "" : value}
          </div>
        );
      })}
    </div>
  );
}
