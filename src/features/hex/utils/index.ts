import { HEX_CONFIG } from "../config";
import { ScoredHexRank } from "../types";

export const getCharSet = (word: string) => {
  return Array.from(new Set(word.split("")));
};

/**
 * Build a bitmask for the given word's charset (a-z = bits 0-25)
 */
export const buildCharsetMask = (word: string): number => {
  let mask = 0;
  const charset = getCharSet(word.toLowerCase());
  for (const ch of charset) {
    const bit = ch.charCodeAt(0) - 97; // 'a' = 0, 'b' = 1, etc.
    mask |= 1 << bit;
  }
  return mask;
};

/**
 * Get the number of unique letters from a wordId bitmask
 * Returns 7 for null wordId (backwards compatibility)
 */
export const getNumLettersFromWordId = (wordId: number | null): number => {
  if (wordId === null) return 7;

  // Count the number of set bits in the bitmask
  let count = 0;
  let mask = wordId;
  while (mask > 0) {
    count += mask & 1;
    mask >>= 1;
  }
  return count;
};

export const isPangramCandidate = (word: string) => {
  const charSet = getCharSet(word);
  return (
    charSet.length >= HEX_CONFIG.minPangramLetters &&
    charSet.length <= HEX_CONFIG.maxPangramLetters
  );
};

export const isPangram = (word: string, pangramLength = 7) =>
  getCharSet(word).length === pangramLength;

export const getWordScore = (word: string, numLetters = 7) =>
  (word.length === 4 ? 1 : word.length) + (isPangram(word, numLetters) ? 7 : 0);

export const getTotalScore = (words: string[], numLetters = 7) =>
  words.reduce((acc, word) => acc + getWordScore(word, numLetters), 0);

export const getRankScoreMap = (maxScore: number) => {
  return HEX_CONFIG.ranks.map((rank) => ({
    ...rank,
    score: Math.floor(rank.percentage * maxScore),
  }));
};

export const getRank = (score: number, rankScoreMap: ScoredHexRank[]) => {
  return rankScoreMap.findLast((rank) => score >= rank.score);
};

export const getWordScoreMap = (words: string[], numLetters = 7) => {
  return words.map((word) => ({
    word,
    score: getWordScore(word, numLetters),
    isPangram: isPangram(word, numLetters),
  }));
};

/**
 * Filter words from a dictionary that match the given wordId and centerLetter.
 * This is the same logic used in the lookup table generation.
 *
 * @param allWords - Array of all words from dictionaries
 * @param wordId - Bitmask representing the charset
 * @param centerLetter - The center letter that must be included
 * @returns Filtered array of words
 */
export const getHexWords = (
  allWords: string[],
  wordId: number,
  centerLetter: string
): string[] => {
  if (!allWords.length || !centerLetter) return [];

  const centerMask = buildCharsetMask(centerLetter);

  return allWords.filter((word) => {
    const wordMask = buildCharsetMask(word);
    // Word's charset must be a subset of wordId's charset
    const matchesMask = (wordMask | wordId) === wordId;
    // Word must contain the center letter
    const containsCenter = (wordMask & centerMask) !== 0;
    return matchesMask && containsCenter;
  });
};
