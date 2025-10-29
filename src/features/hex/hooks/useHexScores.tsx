import { useMemo } from "react";
import {
  getRank,
  getRankScoreMap,
  getTotalScore,
  getWordScoreMap,
  isPangram,
} from "../utils";

export default function useHexScores({
  guessedWords = [],
  wordList = [],
}: {
  guessedWords: string[];
  wordList: string[];
}) {
  const maxScore = useMemo(() => getTotalScore(wordList), [wordList]);
  const rankScoreMap = useMemo(() => getRankScoreMap(maxScore), [maxScore]);

  const score = useMemo(() => getTotalScore(guessedWords), [guessedWords]);
  const rank = useMemo(
    () => getRank(score, rankScoreMap),
    [score, rankScoreMap]
  );
  const wordScoreMap = useMemo(
    () => getWordScoreMap(guessedWords),
    [guessedWords]
  );

  const numPangrams = useMemo(
    () => wordList.filter((word) => isPangram(word)).length,
    [wordList]
  );

  const nextRank = useMemo(
    () => rankScoreMap.find((rank) => score < rank.score),
    [score, rankScoreMap]
  );

  return useMemo(
    () => ({
      score,
      rank,
      nextRank,
      rankScoreMap,
      wordScoreMap,
      maxScore,
      numPangrams,
    }),
    [score, rank, nextRank, rankScoreMap, wordScoreMap, maxScore, numPangrams]
  );
}
