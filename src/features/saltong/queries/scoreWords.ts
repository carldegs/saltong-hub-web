import type { WordScore } from "@/features/saltong/types";

/**
 * Score words using OpenAI API with automatic batching
 * Splits words into batches of 30 and processes them in parallel
 */
export async function scoreWords(words: string[]): Promise<WordScore[]> {
  if (words.length === 0) {
    return [];
  }

  const BATCH_SIZE = 30;
  const batches: string[][] = [];

  // Split into batches
  for (let i = 0; i < words.length; i += BATCH_SIZE) {
    batches.push(words.slice(i, i + BATCH_SIZE));
  }

  // Process all batches in parallel
  const batchPromises = batches.map(async (batch) => {
    const response = await fetch("/api/admin/saltong/score-words", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ words: batch }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.details || error.error || "Failed to score words");
    }

    const data = await response.json();
    return data.scores as WordScore[];
  });

  const results = await Promise.all(batchPromises);

  // Flatten results
  return results.flat();
}

/**
 * Select words based on difficulty ratio
 * @param scoredWords - Words with scores (0=English, 1=very common, 5=very obscure)
 * @param count - Total number of words to select
 * @param ratio - Ratio of easy:medium:hard (default: 0.7:0.2:0.1)
 */
export function selectWordsByDifficulty(
  scoredWords: WordScore[],
  count: number,
  ratio: { easy: number; medium: number; hard: number } = {
    easy: 0.7,
    medium: 0.2,
    hard: 0.1,
  }
): WordScore[] {
  const validWords = scoredWords.filter((w) => w.score > 0);

  const groups = {
    easy: validWords.filter((w) => w.score <= 2),
    medium: validWords.filter((w) => w.score === 3),
    hard: validWords.filter((w) => w.score >= 4),
  };

  const targetEasy = Math.floor(count * ratio.easy);
  const targetMedium = Math.floor(count * ratio.medium);
  const target = {
    easy: targetEasy,
    medium: targetMedium,
    hard: count - targetEasy - targetMedium,
  };

  const shuffle = <T>(arr: T[]): T[] => {
    const out = [...arr];
    for (let i = out.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [out[i], out[j]] = [out[j], out[i]];
    }
    return out;
  };

  const take = <T>(arr: T[], n: number): T[] => shuffle(arr).slice(0, n);

  const selected: WordScore[] = [];

  for (const key of ["easy", "medium", "hard"] as const) {
    const available = groups[key];
    const want = target[key];
    selected.push(...take(available, Math.min(want, available.length)));
  }

  if (selected.length < count) {
    const used = new Set(selected.map((w) => w.word));
    const remaining = validWords.filter((w) => !used.has(w.word));
    selected.push(...take(remaining, count - selected.length));
  }

  return shuffle(selected).slice(0, count);
}
