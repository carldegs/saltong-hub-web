import { useQuery } from "@tanstack/react-query";
import { useSupabaseClient } from "@/lib/supabase/client";
import { getSaltongRecentRounds } from "../queries/getSaltongRecentRounds";
import { DraftRound, SaltongMode } from "../types";

import { useState, useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { addDays, parse, format } from "date-fns";
import { ADMIN_CONSTANTS } from "../constants";
import { formatErrorMessage, validateRoundCount } from "../utils/admin";
import { scoreWords, selectWordsByDifficulty } from "../queries/scoreWords";
import { insertSaltongRounds } from "../queries/insertSaltongRounds";

export function useGetSaltongRecentRounds(mode: SaltongMode, limit = 365) {
  const supabase = useSupabaseClient();

  return useQuery({
    queryKey: ["saltong-recent-rounds", { mode, limit }],
    queryFn: async () => {
      const { data, error } = await getSaltongRecentRounds(
        supabase,
        mode,
        limit
      );
      if (error) throw error;
      return data ?? [];
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

interface UseDraftRoundsOptions {
  mode: SaltongMode;
  dictionary: string[] | null;
  recentWords: Set<string>;
  lastDate: string;
  nextRoundId: number;
}

export function useDraftRounds({
  mode,
  dictionary,
  recentWords,
  lastDate,
  nextRoundId,
}: UseDraftRoundsOptions) {
  const [drafts, setDrafts] = useState<DraftRound[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const queryClient = useQueryClient();

  const pickWord = useCallback(
    (avoid: Set<string>): string | null => {
      if (!dictionary || dictionary.length === 0) return null;

      let attempts = 0;
      const maxAttempts = ADMIN_CONSTANTS.MAX_PICK_ATTEMPTS;

      while (attempts < maxAttempts) {
        const candidate =
          dictionary[Math.floor(Math.random() * dictionary.length)]?.trim();
        if (candidate && !avoid.has(candidate.toLowerCase())) {
          return candidate.toLowerCase();
        }
        attempts++;
      }
      return null;
    },
    [dictionary]
  );

  const generateDrafts = useCallback(
    async (count: number) => {
      const validation = validateRoundCount(
        count,
        ADMIN_CONSTANTS.MAX_ROUNDS_PER_GENERATION
      );
      if (!validation.isValid) {
        alert(validation.error);
        return;
      }

      setIsGenerating(true);
      try {
        // Select candidate words
        const candidateCount = count * ADMIN_CONSTANTS.CANDIDATE_MULTIPLIER;
        const candidateWords: string[] = [];
        const avoid = new Set<string>([...recentWords]);

        let attempts = 0;
        const maxAttempts = candidateCount * 10;
        while (
          candidateWords.length < candidateCount &&
          attempts < maxAttempts
        ) {
          const word = pickWord(avoid);
          if (word) {
            candidateWords.push(word);
            avoid.add(word);
          }
          attempts++;
        }

        if (candidateWords.length < count) {
          alert(
            `Could only find ${candidateWords.length} unique words. Need at least ${count}.`
          );
          return;
        }

        // Score words using AI
        const scoredWords = await scoreWords(candidateWords);
        const selectedWords = selectWordsByDifficulty(scoredWords, count);

        // Create draft rounds
        const start = addDays(parse(lastDate, "yyyy-MM-dd", new Date()), 1);
        const rows: DraftRound[] = selectedWords.map((sw, i) => ({
          date: format(addDays(start, i), "yyyy-MM-dd"),
          word: sw.word,
          roundId: nextRoundId + i,
          score: sw.score,
          explanation: sw.explanation,
        }));

        setDrafts(rows);
      } catch (error) {
        console.error("Failed to generate drafts:", error);
        alert(`Failed to generate drafts: ${formatErrorMessage(error)}`);
      } finally {
        setIsGenerating(false);
      }
    },
    [pickWord, recentWords, lastDate, nextRoundId]
  );

  const regenerateWord = useCallback(
    (index: number) => {
      const avoid = new Set<string>([
        ...recentWords,
        ...drafts.map((d) => d.word.toLowerCase()),
      ]);
      const word = pickWord(avoid) ?? drafts[index]?.word;

      if (!word) return;

      setDrafts((prev) =>
        prev.map((d, i) =>
          i === index
            ? {
                ...d,
                word,
                score: undefined,
                explanation: undefined,
              }
            : d
        )
      );
    },
    [drafts, pickWord, recentWords]
  );

  const clearDrafts = useCallback(() => {
    setDrafts([]);
  }, []);

  const submitDrafts = useCallback(async () => {
    setIsSubmitting(true);
    try {
      const valid = drafts.filter((d) => d.word && d.date);
      if (valid.length === 0) {
        alert("No valid rounds to submit");
        return;
      }

      const res = await insertSaltongRounds({ mode, rounds: valid });
      if (!res?.success) {
        alert(`Failed to insert: ${res?.error ?? "Unknown error"}`);
        return;
      }

      setDrafts([]);
      await queryClient.invalidateQueries({
        queryKey: [
          "saltong-recent-rounds",
          { mode, limit: ADMIN_CONSTANTS.MAX_RECENT_ROUNDS },
        ],
      });
      alert("Rounds inserted successfully!");
    } catch (error) {
      console.error("Failed to submit drafts:", error);
      alert(`Failed to submit rounds: ${formatErrorMessage(error)}`);
    } finally {
      setIsSubmitting(false);
    }
  }, [drafts, mode, queryClient]);

  return {
    drafts,
    isGenerating,
    isSubmitting,
    generateDrafts,
    regenerateWord,
    clearDrafts,
    submitDrafts,
  };
}
