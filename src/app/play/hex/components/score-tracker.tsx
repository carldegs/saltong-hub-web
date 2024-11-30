import { cn } from "@/lib/utils";
import useHexScores from "../hooks/useHexScores";

export default function ScoreTracker({
  guessedWords,
  wordList,
}: {
  guessedWords: string[];
  wordList: string[];
}) {
  const { score, rank, nextRank, rankScoreMap } = useHexScores({
    guessedWords,
    wordList,
  });

  return (
    <div className="relative mx-auto flex w-full max-w-[600px] select-none flex-col gap-3 px-4">
      <div className="flex items-center justify-center">
        <span className="text-center text-xl font-bold tracking-widest text-saltong-purple">
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
                  className="relative h-full rounded-full bg-saltong-purple px-4 transition-all"
                  style={{
                    width: `${((score - rank.score) / ((nextRank?.score ?? 0) - rank.score)) * 100}%`,
                  }}
                >
                  <span className="z-1 absolute -top-1 right-0 h-6 rounded-full bg-saltong-purple px-2 text-center font-bold text-saltong-purple-200">
                    {score}
                  </span>
                </div>

                {i < rankScoreMap.length - 1 && (
                  <span className="z-1 absolute -bottom-6 -right-1 font-bold opacity-80">
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
