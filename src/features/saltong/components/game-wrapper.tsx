"use client";

import { useEffect, useMemo, useState } from "react";
import { useEventListener, useIsMounted } from "usehooks-ts";
import Keyboard from "./keyboard";
import SaltongGrid from "./saltong-grid";
import { LetterStatus, SaltongMode, SaltongRound } from "../types";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useModalStore } from "@/providers/modal/modal-provider";
import { useDictionary } from "@/features/dictionary/hooks";
import { getLetterStatusGrid } from "../utils/getLetterStatusGrid";
import { sendEvent } from "@/lib/analytics";
import {
  useSaltongUserRound,
  useSaltongUserRoundMutation,
} from "../hooks/user-round";
import { useSaltongUserStatsMutation } from "../hooks/user-stats";

export default function GameWrapper({
  maxTries,
  wordLen,
  roundData,
  isLive = false,
  userId,
}: {
  maxTries: number;
  wordLen: number;
  roundData: SaltongRound;
  isLive?: boolean;
  userId?: string;
}) {
  const { dict, isLoading: isFetchingDict } = useDictionary(wordLen);
  const { data: userRound } = useSaltongUserRound({
    mode: roundData.mode as SaltongMode,
    date: roundData.date,
    userId: userId ?? "unauthenticated",
  });

  const { mutate: setAnswer } = useSaltongUserRoundMutation();
  const { mutate: setStats } = useSaltongUserStatsMutation();

  const userRoundGrid = useMemo(() => userRound?.grid ?? "", [userRound?.grid]);

  const [inputData, setInputData] = useState<string>("");
  const isMounted = useIsMounted();

  const { onOpenChange } = useModalStore((state) => state);

  const status = useMemo(
    () =>
      getLetterStatusGrid({
        gridStr: userRoundGrid,
        word: roundData.word,
        wordLen,
      }),
    [userRoundGrid, roundData.word, wordLen]
  );

  const keyboardStatus = useMemo(() => {
    const res: Record<string, string> = {};
    userRoundGrid.split("").forEach((letter, i) => {
      const currentStatus = res?.[letter];
      const newStatus = status[i];

      // Priority: Correct > Partial > Incorrect
      if (currentStatus === LetterStatus.Correct) {
        return;
      } else if (
        currentStatus === LetterStatus.Partial &&
        newStatus !== LetterStatus.Correct
      ) {
        return;
      }

      res[letter] = newStatus;
    });

    return res;
  }, [userRoundGrid, status]);

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
    if (userRound?.endedAt || isLoading || isFetchingDict) {
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
        (userRoundGrid + inputData).length / wordLen >= maxTries;

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

      const grid = userRoundGrid + inputData;
      const answerData = {
        grid,
        startedAt: userRound?.startedAt || new Date().toISOString(),
        endedAt:
          isCurrAnswerCorrect || isTriesExceeded
            ? new Date().toISOString()
            : null,
        answer: isCurrAnswerCorrect || isTriesExceeded ? roundData.word : "",
        isCorrect: isCurrAnswerCorrect,
        solvedLive: isCurrAnswerCorrect && isLive,
        solvedTurn: isCurrAnswerCorrect ? grid.length / wordLen : null,
        userId: userId ?? "unauthenticated",
        mode: roundData.mode as SaltongMode,
        date: roundData.date,
      };
      setAnswer(answerData);

      // Update stats when the round ends
      if (isCurrAnswerCorrect || isTriesExceeded) {
        setStats({
          userId: userId ?? "unauthenticated",
          mode: roundData.mode as SaltongMode,
          roundData: {
            isCorrect: isCurrAnswerCorrect,
            solvedTurn: isCurrAnswerCorrect ? grid.length / wordLen : null,
            solvedLive: isCurrAnswerCorrect && isLive,
            date: roundData.date,
            roundId: roundData.roundId,
          },
        });
      }

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { word, ...data } = roundData;
      sendEvent("send_answer", {
        ...data,
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
        {userRound?.answer && (
          <a
            href={`https://tagalog.pinoydictionary.com/search?q=${userRound.answer}`}
            target="_blank"
          >
            <div
              className={cn(
                {
                  "bg-green-700 text-green-200": userRound?.isCorrect,
                  "bg-teal-700 text-teal-200": !userRound?.isCorrect,
                  "opacity-0": !userRound?.endedAt,
                },
                "rounded-md px-4 py-2"
              )}
            >
              <p className="text-2xl font-black tracking-widest">
                {userRound.answer?.toUpperCase() ?? "??????"}
              </p>
            </div>
          </a>
        )}
        <SaltongGrid
          maxTries={maxTries}
          wordLen={wordLen}
          grid={userRoundGrid}
          status={status}
          inputData={inputData}
          disabled={!!userRound?.endedAt}
          isLoading={!isMounted()}
        />
      </main>
      <Keyboard
        status={keyboardStatus}
        onKeyClick={onKeyDown}
        disabled={!!userRound?.endedAt || !isMounted()}
      />
    </>
  );
}
