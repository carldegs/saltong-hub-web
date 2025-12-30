export type HexRoundScore = {
  wordId: number;
  centerLetter: string;
  rootWord: string;
  numWords: number;
  numPangrams: number;
  numLetters: number;
  score: number;
};

type RangeRule = {
  min: number;
  max: number;
  score: number;
};

/**
 * Scoring rules for hex rounds based on number of words
 * Score ranges:
 * 1 - 40-60 words (Easy)
 * 2 - 30-40 and 60-70 words (Medium-Easy)
 * 3 - 20-30 and 70-80 words (Medium)
 * 4 - 0-20 and 80-100 words (Hard)
 * 5 - >100 words (Very Hard)
 */
const SCORING_RULES: RangeRule[] = [
  { min: 0, max: 9, score: 5 },
  { min: 10, max: 19, score: 4 },
  { min: 20, max: 29, score: 3 },
  { min: 30, max: 39, score: 2 },
  { min: 40, max: 60, score: 1 },
  { min: 61, max: 70, score: 2 },
  { min: 71, max: 80, score: 3 },
  { min: 81, max: 100, score: 4 },
  { min: 101, max: Infinity, score: 5 },
];

export function scoreHexRound(
  round: Omit<HexRoundScore, "score">
): HexRoundScore {
  const { numWords } = round;

  const rule = SCORING_RULES.find(
    (r) => numWords >= r.min && numWords <= r.max
  )!;

  return {
    ...round,
    score: rule.score,
  };
}

/**
 * Score multiple hex rounds
 */
export function scoreHexRounds(
  rounds: Omit<HexRoundScore, "score">[]
): HexRoundScore[] {
  return rounds.map(scoreHexRound);
}

/**
 * Select hex rounds based on difficulty ratio
 * @param scoredRounds - Rounds with scores (1=easy, 5=very hard)
 * @param count - Total number of rounds to select
 * @param ratio - Ratio of difficulties (default: 1:80%, 2&3:15%, 4:4%, 5:1%)
 */
export function selectHexRoundsByDifficulty(
  scoredRounds: HexRoundScore[],
  count: number,
  ratio: {
    score1: number;
    score2and3: number;
    score4: number;
    score5: number;
  } = {
    score1: 0.8,
    score2and3: 0.15,
    score4: 0.04,
    score5: 0.01,
  }
): HexRoundScore[] {
  // Group by difficulty score
  const score1 = scoredRounds.filter((r) => r.score === 1);
  const score2and3 = scoredRounds.filter((r) => r.score === 2 || r.score === 3);
  const score4 = scoredRounds.filter((r) => r.score === 4);
  const score5 = scoredRounds.filter((r) => r.score === 5);

  // Calculate target counts
  const targetScore1 = Math.floor(count * ratio.score1);
  const targetScore2and3 = Math.floor(count * ratio.score2and3);
  const targetScore4 = Math.floor(count * ratio.score4);
  const targetScore5 = Math.floor(count * ratio.score5);

  // Ensure we get exactly the count we need
  const remaining =
    count - targetScore1 - targetScore2and3 - targetScore4 - targetScore5;

  // Select from each category
  const selected: HexRoundScore[] = [];

  // Helper to randomly select n items from array
  const randomSelect = (arr: HexRoundScore[], n: number): HexRoundScore[] => {
    const shuffled = [...arr].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, n);
  };

  // Try to meet the ratios
  selected.push(...randomSelect(score1, Math.min(targetScore1, score1.length)));
  selected.push(
    ...randomSelect(score2and3, Math.min(targetScore2and3, score2and3.length))
  );
  selected.push(...randomSelect(score4, Math.min(targetScore4, score4.length)));
  selected.push(...randomSelect(score5, Math.min(targetScore5, score5.length)));

  // Add remaining to score1 (easy) if we have any
  if (remaining > 0 && selected.length < count) {
    const unusedScore1 = score1.filter(
      (r) =>
        !selected.find(
          (s) => s.wordId === r.wordId && s.centerLetter === r.centerLetter
        )
    );
    selected.push(...randomSelect(unusedScore1, remaining));
  }

  // If we still don't have enough, fill from all remaining rounds
  if (selected.length < count) {
    const allRemaining = scoredRounds.filter(
      (r) =>
        !selected.find(
          (s) => s.wordId === r.wordId && s.centerLetter === r.centerLetter
        )
    );
    const needed = count - selected.length;
    selected.push(...randomSelect(allRemaining, needed));
  }

  // Randomize final order
  return selected.sort(() => Math.random() - 0.5);
}
