"use client";

import { useEffect, useMemo, useState } from "react";
import { useEventListener, useIsMounted } from "usehooks-ts";
import Keyboard from "./keyboard";
import SaltongGrid from "./saltong-grid";
import {
  GameMode,
  LetterStatus,
  RoundAnswerData,
  SaltongRound,
} from "../types";
import { toast } from "sonner";
import useRoundAnswer from "../hooks/useRoundAnswer";
import { cn } from "@/lib/utils";
import { useModalStore } from "@/providers/modal/modal-provider";
import { useDictionary } from "@/features/dictionary/hooks";

export default function GameWrapper({
  maxTries,
  wordLen,
  roundData,
  mode,
  isLive,
}: {
  maxTries: number;
  wordLen: number;
  roundData: SaltongRound;
  mode: GameMode;
  isLive?: boolean;
}) {
  const { dict, isLoading: isFetchingDict } = useDictionary(wordLen);
  const [playerAnswer, setPlayerAnswer] = useRoundAnswer(
    mode,
    roundData.date,
    roundData.gameId
  );
  const [inputData, setInputData] = useState<string>("");
  const isMounted = useIsMounted();

  const { onOpenChange } = useModalStore((state) => state);

  const status = useMemo(() => {
    const guessList =
      playerAnswer.grid.match(new RegExp(`.{1,${wordLen}}`, "g")) || [];
    let finalResults = "";

    for (let i = 0; i < guessList.length; i++) {
      const guess = guessList[i];
      const result = Array(wordLen).fill(LetterStatus.Incorrect);

      const answerLetters: (string | null)[] = roundData.word.split("");
      const guessLetters: (string | null)[] = guess.split("");

      // check for correct letters
      for (let j = 0; j < wordLen; j++) {
        if (answerLetters[j] === guessLetters[j]) {
          result[j] = LetterStatus.Correct;
          answerLetters[j] = null;
          guessLetters[j] = null;
        }
      }

      // check for partial letters
      for (let j = 0; j < wordLen; j++) {
        if (guessLetters[j] === null) {
          continue;
        }

        const index = answerLetters.indexOf(guessLetters[j]);

        if (index !== -1) {
          result[j] = LetterStatus.Partial;
          answerLetters[index] = null;
        }
      }

      finalResults += result.join("");
    }

    return finalResults;
  }, [playerAnswer.grid, roundData.word, wordLen]);

  const keyboardStatus = useMemo(() => {
    let res: Record<string, string> = {};
    playerAnswer.grid.split("").forEach((letter, i) => {
      res = {
        ...res,
        [letter]:
          res?.[letter] === LetterStatus.Correct
            ? LetterStatus.Correct
            : status[i],
      };
    });

    return res;
  }, [playerAnswer.grid, status]);

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isFetchingDict) {
      const loadingToast = toast.loading("Loading dictionary...");

      return () => {
        toast.dismiss(loadingToast);
      };
    }
  }, [isFetchingDict]);

  function onKeyDown(e: KeyboardEvent | { key: string }) {
    if (playerAnswer.endedAt || isLoading || isFetchingDict) {
      return;
    }

    if (e.key === "Enter") {
      if (inputData.length !== wordLen) {
        toast.error("Not enough letters!", {
          position: "top-center",
          duration: 2000,
        });
        return;
      }

      const isCurrAnswerCorrect = inputData === roundData.word;
      const isTriesExceeded =
        (playerAnswer.grid + inputData).length / wordLen >= maxTries;

      const isValidWord = dict.includes(inputData);

      if (!isValidWord) {
        toast.error("Word not found!", {
          position: "top-center",
          duration: 2000,
        });
        setIsLoading(false);
        return;
      }

      if (isCurrAnswerCorrect || isTriesExceeded) {
        setTimeout(() => {
          onOpenChange(true);
        }, 500);
      }

      setPlayerAnswer((prev) => {
        const grid = prev.grid + inputData;

        return {
          ...prev,
          grid: prev.grid + inputData,
          startedAt: prev.startedAt || Date.now(),
          endedAt:
            isCurrAnswerCorrect || isTriesExceeded ? Date.now() : undefined,
          answer:
            isCurrAnswerCorrect || isTriesExceeded ? roundData.word : undefined,
          isCorrect: isCurrAnswerCorrect,
          solvedLive: isCurrAnswerCorrect && isLive,
          solvedTurn: isCurrAnswerCorrect ? grid.length / wordLen : undefined,
        } satisfies RoundAnswerData;
      });
      setInputData("");
      setIsLoading(false);
      return;
    }

    if (e.key === "Backspace") {
      setInputData((prev) => prev.slice(0, -1));
      return;
    }

    if (
      e.key.length === 1 &&
      e.key.match(/[a-z]/i) &&
      inputData.length < wordLen
    ) {
      setInputData((prev) => prev + e.key.toLowerCase());
    }

    if (e.key === "Escape") {
      setInputData("");
    }
  }

  useEventListener("keydown", onKeyDown);

  return (
    <>
      <main className="my-6 flex h-full flex-grow flex-col items-center justify-center gap-8">
        {playerAnswer.answer && (
          <a
            href={`https://tagalog.pinoydictionary.com/search?q=${playerAnswer.answer}`}
            target="_blank"
          >
            <div
              className={cn(
                {
                  "bg-green-700 text-green-200": playerAnswer.isCorrect,
                  "bg-teal-700 text-teal-200": !playerAnswer.isCorrect,
                  "opacity-0": !playerAnswer.endedAt,
                },
                "rounded-md px-4 py-2"
              )}
            >
              <p className="text-2xl font-black tracking-widest">
                {playerAnswer.answer?.toUpperCase() ?? "??????"}
              </p>
            </div>
          </a>
        )}
        <SaltongGrid
          maxTries={maxTries}
          wordLen={wordLen}
          grid={playerAnswer.grid}
          status={status}
          inputData={inputData}
          disabled={!!playerAnswer.endedAt}
          isLoading={!isMounted()}
        />
      </main>
      <Keyboard
        status={keyboardStatus}
        onKeyClick={onKeyDown}
        disabled={!!playerAnswer.endedAt || !isMounted()}
      />
    </>
  );
}
