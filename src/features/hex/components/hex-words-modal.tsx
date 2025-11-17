"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Loader2, Sparkles, AlertCircle } from "lucide-react";
import { useMemo } from "react";
import { getCharSet, getTotalScore, isPangram } from "../utils";
import { HexRound } from "../types";

interface HexWordsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  round: HexRound | null;
  isLoading?: boolean;
}

export function HexWordsModal({
  open,
  onOpenChange,
  round,
  isLoading = false,
}: HexWordsModalProps) {
  const data = useMemo(() => {
    if (!round || !round.words) {
      return {
        words: [],
        pangrams: [],
        totalScore: 0,
        rootWord: "",
      };
    }

    const rootWord = round.rootWord ?? "";
    const words = round.words.split(",");
    const numLetters = getCharSet(rootWord).length;
    const pangrams = words.filter((word) => isPangram(word, numLetters));
    const totalScore = getTotalScore(words, numLetters);

    return { words, pangrams, totalScore, rootWord };
  }, [round]);

  const wordCountMismatch =
    round?.numWords !== undefined && data.words.length !== round.numWords;
  const pangramSet = new Set(data.pangrams);

  if (!round) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <span className="font-mono uppercase">{data.rootWord}</span>
            <Badge variant="outline" className="font-mono">
              Center: {round.centerLetter?.toUpperCase() ?? ""}
            </Badge>
          </DialogTitle>
          <DialogDescription>
            Word ID: {round.wordId} • {data.words.length} words •{" "}
            {data.pangrams.length}{" "}
            {data.pangrams.length !== 1 ? "pangrams" : "pangram"} • Max Score:{" "}
            {data.totalScore}
          </DialogDescription>
        </DialogHeader>

        {wordCountMismatch && (
          <div className="flex items-center gap-2 rounded-md border border-yellow-500/50 bg-yellow-500/10 px-3 py-2 text-sm text-yellow-700 dark:text-yellow-400">
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
            <span>
              Expected {round.numWords} words but found {data.words.length}.
              Word list may have changed.
            </span>
          </div>
        )}

        {isLoading ? (
          <div className="flex min-h-[300px] items-center justify-center">
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="text-muted-foreground h-8 w-8 animate-spin" />
              <p className="text-muted-foreground text-sm">Loading words...</p>
            </div>
          </div>
        ) : (
          <ScrollArea className="h-[500px]">
            <div className="grid grid-cols-2 gap-2 p-4 sm:grid-cols-3 md:grid-cols-3">
              {data.words.map((word) => {
                const isWordPangram = pangramSet.has(word);
                return (
                  <div
                    key={word}
                    className={`flex items-center gap-1.5 rounded-md border px-3 py-2 font-mono text-sm ${
                      isWordPangram
                        ? "border-primary bg-primary/10 font-semibold"
                        : "border-border"
                    }`}
                  >
                    {isWordPangram && (
                      <Sparkles className="text-primary h-3.5 w-3.5" />
                    )}
                    <span className="uppercase">{word}</span>
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        )}
      </DialogContent>
    </Dialog>
  );
}
