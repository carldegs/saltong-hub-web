import useHexAnswer from "../hooks/useHexAnswer";
import { HexRound } from "../types";
import { Skeleton } from "@/components/ui/skeleton";

export default function WordListCard({
  date,
  roundData,
}: {
  date: string;
  roundData: HexRound;
}) {
  const { numWords } = roundData;
  const [playerAnswer, , { isInit }] = useHexAnswer(date);

  return (
    <div className="border-1 m-6 hidden h-full max-h-[calc(100dvh-108px)] w-full min-w-[350px] max-w-[400px] flex-col gap-4 overflow-hidden rounded-lg border border-saltong-purple/70 bg-saltong-purple-700/5 pt-6 lg:flex">
      {isInit ? (
        <p className="text-center text-lg font-bold tracking-tight opacity-80">
          {playerAnswer.guessedWords.length}/{numWords} words found
        </p>
      ) : (
        <Skeleton className="w-ful mx-6 h-5" />
      )}
      <div className="grid grid-cols-2 gap-x-2 overflow-auto px-6 pb-6">
        {isInit
          ? playerAnswer.guessedWords.map((word) => (
              <span key={word} className="h-fit opacity-80">
                {word}
              </span>
            ))
          : [...Array(10)].map((_, idx) => (
              <Skeleton key={idx} className="mb-2 h-5 w-full" />
            ))}
      </div>
    </div>
  );
}
