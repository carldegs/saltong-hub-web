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
  numLetters = 7,
}: {
  guessedWords: string[];
  wordList: string[];
  numLetters?: number;
}) {
  const maxScore = useMemo(
    () => getTotalScore(wordList, numLetters),
    [wordList, numLetters]
  );
  const rankScoreMap = useMemo(() => getRankScoreMap(maxScore), [maxScore]);

  const score = useMemo(
    () => getTotalScore(guessedWords, numLetters),
    [guessedWords, numLetters]
  );
  const rank = useMemo(
    () => getRank(score, rankScoreMap),
    [score, rankScoreMap]
  );
  const wordScoreMap = useMemo(
    () => getWordScoreMap(guessedWords, numLetters),
    [guessedWords, numLetters]
  );

  const numPangrams = useMemo(
    () => wordList.filter((word) => isPangram(word, numLetters)).length,
    [wordList, numLetters]
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
