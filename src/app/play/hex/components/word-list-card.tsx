import useHexAnswer from "../hooks/useHexAnswer";
import { HexRound } from "../types";
import WordListContent from "./word-list-content";

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
      <WordListContent
        isLoading={!isInit}
        words={playerAnswer.guessedWords}
        numWordsToGuess={numWords ?? 0}
      />
    </div>
  );
}
