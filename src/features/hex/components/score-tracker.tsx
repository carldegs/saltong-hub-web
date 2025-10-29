import { cn } from "@/lib/utils";
import useHexScores from "../hooks/useHexScores";

export default function ScoreTracker({
  guessedWords,
  wordList,
  isGameOver,
}: {
  guessedWords: string[];
  wordList: string[];
  isGameOver?: boolean;
}) {
  const { score, rank, nextRank, rankScoreMap } = useHexScores({
    guessedWords,
    wordList,
  });

  if (isGameOver) {
    return (
      <div className="bg-saltong-purple/10 border-saltong-purple relative mx-auto flex w-[90%] max-w-[600px] flex-col gap-3 rounded-lg border select-none">
        <div className="flex h-full flex-col items-center justify-center">
          <span className="text-saltong-purple/80 leading-widest text-sm font-bold">
            YOUR FINAL RANK
          </span>
          <span className="text-saltong-purple text-center text-2xl font-bold tracking-widest">
            {rank?.icon ?? ""}
            {"  "}
            {rank?.name.toUpperCase() ?? ""}
          </span>
          <span className="text-saltong-purple/80 leading-widest text-sm font-bold">
            {score} POINTS
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="relative mx-auto flex w-full max-w-[600px] flex-col gap-3 px-4 select-none">
      <div className="flex items-center justify-center">
        <span className="text-saltong-purple text-center text-xl font-bold tracking-widest">
          {rank?.icon ?? ""}
          {"  "}
          {rank?.name.toUpperCase() ?? ""}
        </span>
      </div>
      <div className="z-1 flex w-full items-center justify-between gap-1.5">
        {rankScoreMap.map(({ name, score: currScore }, i) => (
          <div
            key={name}
            className={cn(
              "relative h-3 w-3 min-w-3 rounded-full bg-gray-300 transition-all dark:bg-gray-700",
              {
                "w-full": rank?.name === name,
                "bg-saltong-purple dark:bg-saltong-purple":
                  score > currScore && rank?.name !== name,
              }
            )}
          >
            {rank?.name === name && (
              <>
                <div
                  className="bg-saltong-purple relative h-full rounded-full px-4 transition-all"
                  style={{
                    width: `${((score - rank.score) / ((nextRank?.score ?? 0) - rank.score)) * 100}%`,
                  }}
                >
                  <span className="bg-saltong-purple text-saltong-purple-200 absolute -top-1 right-0 z-1 h-6 rounded-full px-2 text-center font-bold">
                    {score}
                  </span>
                </div>

                {i < rankScoreMap.length - 1 && (
                  <span className="absolute -right-1 -bottom-6 z-1 font-bold opacity-80">
                    {nextRank?.score ?? 0}
                  </span>
                )}
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
