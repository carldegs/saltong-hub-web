import { HexAnswerData, HexRound } from "../types";
import WordListContent from "./word-list-content";

export default function WordListCard({
  roundData,
  playerAnswer,
  isInit,
}: {
  roundData: HexRound;
  playerAnswer: HexAnswerData;
  isInit: boolean;
}) {
  const { numWords } = roundData;

  return (
    <div className="border-saltong-purple/70 bg-saltong-purple-700/5 m-6 hidden h-full max-h-[calc(100dvh-108px)] w-full max-w-[400px] min-w-[350px] flex-col gap-4 overflow-hidden rounded-lg border border-1 pt-6 lg:flex">
      <WordListContent
        isLoading={!isInit}
        words={playerAnswer.guessedWords}
        numWordsToGuess={numWords ?? 0}
      />
    </div>
  );
}
