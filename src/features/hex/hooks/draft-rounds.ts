import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { scoreHexRounds } from "../queries/scoreHexRounds";
import {
  buildCharsetMask,
  getHexWords,
  getTotalScore,
  isPangram,
  getCharSet,
  getNumLettersFromWordId,
} from "../utils";
import { getNextHexDates } from "@/utils/time";
import { HexRound, HexLookupTableItem } from "../types";
import { insertHexRounds } from "../queries/insertHexRounds";

export type DraftHexRound = HexRound & {
  score?: number;
};

interface UseDraftRoundsParams {
  allWords: string[];
  filteredLookupTable: HexLookupTableItem[];
  recentRounds: HexRound[];
  lastDate: string;
  nextRoundId: number;
}

export function getHexRoundData(
  draft: DraftHexRound,
  allWords: string[]
): HexRound {
  if (!draft.wordId || !draft.centerLetter) {
    throw new Error("Invalid draft: missing wordId or centerLetter");
  }

  const rootWord =
    allWords.find((word) => buildCharsetMask(word) === draft.wordId) ??
    draft.rootWord ??
    "";
  const words = getHexWords(allWords, draft.wordId, draft.centerLetter);
  const numLetters =
    getCharSet(rootWord).length || getNumLettersFromWordId(draft.wordId);
  const maxScore = getTotalScore(words, numLetters);

  return {
    date: draft.date,
    centerLetter: draft.centerLetter,
    rootWord,
    wordId: draft.wordId,
    words: words.join(","),
    roundId: draft.roundId,
    maxScore,
    numWords: words.length,
    numPangrams: words.filter((word) => isPangram(word, numLetters)).length,
    createdAt: new Date().toISOString(),
  };
}

export function useDraftRounds({
  allWords,
  filteredLookupTable,
  recentRounds,
  lastDate,
  nextRoundId,
}: UseDraftRoundsParams) {
  const [preview, setPreview] = useState<DraftHexRound[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const queryClient = useQueryClient();

  async function generateDrafts(n: number) {
    if (n > 200) {
      alert("Maximum 200 rounds can be generated at once");
      return;
    }
    setIsGenerating(true);
    try {
      if (!filteredLookupTable || filteredLookupTable.length === 0) {
        alert(
          "No available rounds in lookup table. Please regenerate it or all rounds have been used."
        );
        return;
      }

      const scoredLookupTable = scoreHexRounds(
        filteredLookupTable.map((r) => ({
          wordId: r.wordId,
          centerLetter: r.centerLetter,
          rootWord: r.rootWord,
          numWords: r.numWords,
          numPangrams: r.numPangrams,
          numLetters: r.numLetters,
        }))
      );

      const score1Rounds = scoredLookupTable.filter((r) => r.score === 1);
      const score2and3Rounds = scoredLookupTable.filter(
        (r) => r.score === 2 || r.score === 3
      );
      const score4Rounds = scoredLookupTable.filter((r) => r.score === 4);
      const score5Rounds = scoredLookupTable.filter((r) => r.score === 5);

      const ratio = {
        score1: 0.8,
        score2and3: 0.15,
        score4: 0.04,
        score5: 0.01,
      };

      const targetScore1 = Math.floor(n * ratio.score1);
      const targetScore2and3 = Math.floor(n * ratio.score2and3);
      const targetScore4 = Math.floor(n * ratio.score4);
      const targetScore5 = Math.floor(n * ratio.score5);

      const randomSelect = <T>(arr: T[], count: number): T[] => {
        const shuffled = [...arr].sort(() => Math.random() - 0.5);
        return shuffled.slice(0, Math.min(count, arr.length));
      };

      const selected: typeof scoredLookupTable = [];
      selected.push(...randomSelect(score1Rounds, targetScore1));
      selected.push(...randomSelect(score2and3Rounds, targetScore2and3));
      selected.push(...randomSelect(score4Rounds, targetScore4));
      selected.push(...randomSelect(score5Rounds, targetScore5));

      if (selected.length < n) {
        const needed = n - selected.length;
        const unusedScore1 = score1Rounds.filter(
          (r) =>
            !selected.find(
              (s) => s.wordId === r.wordId && s.centerLetter === r.centerLetter
            )
        );
        selected.push(...randomSelect(unusedScore1, needed));
      }

      if (selected.length < n) {
        const needed = n - selected.length;
        const allUnused = scoredLookupTable.filter(
          (r) =>
            !selected.find(
              (s) => s.wordId === r.wordId && s.centerLetter === r.centerLetter
            )
        );
        selected.push(...randomSelect(allUnused, needed));
      }

      if (selected.length < n) {
        alert(
          `Could only generate ${selected.length} rounds. Not enough available rounds in lookup table.`
        );
        if (selected.length === 0) {
          return;
        }
      }

      const shuffledSelected = selected.sort(() => Math.random() - 0.5);
      const hexDates = getNextHexDates(lastDate, shuffledSelected.length);
      const rows: DraftHexRound[] = shuffledSelected.map((sr, i) => ({
        date: hexDates[i],
        centerLetter: sr.centerLetter,
        rootWord: sr.rootWord,
        wordId: sr.wordId,
        words: "",
        roundId: nextRoundId + i,
        createdAt: null,
        maxScore: null,
        score: sr.score,
        numWords: sr.numWords,
        numPangrams: sr.numPangrams,
      }));

      setPreview(rows);
    } catch (error) {
      console.error("Failed to generate drafts:", error);
      alert(
        `Failed to generate drafts: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    } finally {
      setIsGenerating(false);
    }
  }

  function regenerateAt(index: number) {
    if (!filteredLookupTable || filteredLookupTable.length === 0) {
      alert("No available rounds in lookup table.");
      return;
    }

    const usedCombos = new Set([
      ...recentRounds
        .map((r) => {
          const wordId =
            r.wordId ?? (r.rootWord ? buildCharsetMask(r.rootWord) : null);
          return wordId !== null ? `${wordId}-${r.centerLetter}` : null;
        })
        .filter((combo): combo is string => combo !== null),
      ...preview.map((d) => `${d.wordId}-${d.centerLetter}`),
    ]);

    const availableRounds = filteredLookupTable.filter(
      (row) => !usedCombos.has(`${row.wordId}-${row.centerLetter}`)
    );

    if (availableRounds.length === 0) {
      alert("No more unused rounds available in lookup table");
      return;
    }

    const randomRound =
      availableRounds[Math.floor(Math.random() * availableRounds.length)];

    if (!randomRound) return;

    const scoredRound = scoreHexRounds([
      {
        wordId: randomRound.wordId,
        centerLetter: randomRound.centerLetter,
        rootWord: randomRound.rootWord,
        numWords: randomRound.numWords,
        numPangrams: randomRound.numPangrams,
        numLetters: randomRound.numLetters,
      },
    ])[0];

    if (!scoredRound) return;

    setPreview((prev) =>
      prev.map((d, i) =>
        i === index
          ? {
              ...d,
              centerLetter: scoredRound.centerLetter,
              rootWord: scoredRound.rootWord,
              wordId: scoredRound.wordId,
              score: scoredRound.score,
              numWords: scoredRound.numWords,
              numPangrams: scoredRound.numPangrams,
            }
          : d
      )
    );
  }

  async function submitPreview() {
    setIsSubmitting(true);
    try {
      if (!allWords.length) {
        alert("Dictionary not loaded. Please wait and try again.");
        return;
      }

      if (preview.length === 0) {
        alert("No drafts to submit.");
        return;
      }

      const roundsToSubmit = preview.map((draft) =>
        getHexRoundData(draft, allWords)
      );

      const result = await insertHexRounds({ rounds: roundsToSubmit });

      if (!result.success) {
        throw new Error(result.error || "Failed to insert rounds");
      }

      setPreview([]);
      await queryClient.invalidateQueries({
        queryKey: ["hex-recent-rounds", { limit: 200 }],
      });

      alert(`Successfully submitted ${roundsToSubmit.length} rounds!`);
    } catch (error) {
      console.error("Failed to submit rounds:", error);
      alert(
        `Failed to submit rounds: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return {
    drafts: preview,
    isGenerating,
    isSubmitting,
    generateDrafts,
    regenerateAt,
    clearDrafts: () => setPreview([]),
    submitDrafts: submitPreview,
  };
}
