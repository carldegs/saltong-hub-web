"use client";

import { useEffect, useMemo, useState } from "react";
import { useEventListener, useIsMounted } from "usehooks-ts";
import Keyboard from "./keyboard";
import SaltongGrid from "./saltong-grid";
import { LetterStatus, SaltongRound } from "../types";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useModalStore } from "@/providers/modal/modal-provider";
import { useDictionary } from "@/features/dictionary/hooks";
import { getLetterStatusGrid } from "../utils";
import { GameId } from "../../types";
import { sendEvent } from "@/lib/analytics";
import { useSaltongAnswer } from "../hooks/useSaltongAnswers";
import { useSaltongStat } from "../hooks/useSaltongStats";

export default function GameWrapper({
  maxTries,
  wordLen,
  roundData,
  gameId,
  isLive,
  userId,
}: {
  maxTries: number;
  wordLen: number;
  roundData: SaltongRound;
  gameId: GameId;
  isLive?: boolean;
  userId?: string;
}) {
  const { dict, isLoading: isFetchingDict } = useDictionary(wordLen);
  const [playerAnswer, setAnswer] = useSaltongAnswer({
    userId: userId ?? "unauthenticated",
    gameId,
    gameDate: roundData.date,
  });
  const [, setStat] = useSaltongStat({
    userId: userId ?? "unauthenticated",
    gameId,
    gameDate: roundData.date,
  });

  const [inputData, setInputData] = useState<string>("");
  const isMounted = useIsMounted();

  const { onOpenChange } = useModalStore((state) => state);

  const status = useMemo(
    () =>
      getLetterStatusGrid({
        gridStr: playerAnswer.grid,
        word: roundData.word,
        wordLen,
      }),
    [playerAnswer.grid, roundData.word, wordLen]
  );

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

      const grid = playerAnswer.grid + inputData;
      const answerData = {
        grid,
        startedAt: playerAnswer.startedAt || Date.now(),
        endedAt:
          isCurrAnswerCorrect || isTriesExceeded ? Date.now() : undefined,
        answer:
          isCurrAnswerCorrect || isTriesExceeded ? roundData.word : undefined,
        isCorrect: isCurrAnswerCorrect,
        solvedLive: isCurrAnswerCorrect && isLive,
        solvedTurn: isCurrAnswerCorrect ? grid.length / wordLen : undefined,
      };
      setAnswer(answerData);

      setStat({
        ...answerData,
        roundId: roundData.gameId,
      });

      sendEvent("send_answer", {
        gameId,
        roundId: roundData.gameId,
        date: roundData.date,
        isCorrect: isCurrAnswerCorrect,
        isLive,
        answer: inputData,
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
      <main className="my-6 flex h-full grow flex-col items-center justify-center gap-8">
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
