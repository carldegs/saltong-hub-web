import { HEX_CONFIG } from "./config";
import { ScoredHexRank } from "./types";

export const isPangram = (word: string) =>
  Array.from(new Set(word)).length === 7;

export const getWordScore = (word: string) =>
  (word.length === 4 ? 1 : word.length) + (isPangram(word) ? 7 : 0);

export const getTotalScore = (words: string[]) =>
  words.reduce((acc, word) => acc + getWordScore(word), 0);

export const getRankScoreMap = (maxScore: number) => {
  return HEX_CONFIG.ranks.map((rank) => ({
    ...rank,
    score: Math.floor(rank.percentage * maxScore),
  }));
};

export const getRank = (score: number, rankScoreMap: ScoredHexRank[]) => {
  return rankScoreMap.findLast((rank) => score >= rank.score);
};

export const getWordScoreMap = (words: string[]) => {
  return words.map((word) => ({
    word,
    score: getWordScore(word),
    isPangram: isPangram(word),
  }));
};
