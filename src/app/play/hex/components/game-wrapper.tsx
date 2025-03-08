"use client";

// import { useDictionary } from "@/features/dictionary/hooks";
import { HexRound } from "../types";
import HexKeyboard from "./hex-keyboard";
import useHexStore from "../hooks/useHexStore";
import { cn } from "@/lib/utils";
import { useEventListener } from "usehooks-ts";
import { toast } from "sonner";
import { useMemo, useState } from "react";
import useHexAnswer from "../hooks/useHexAnswer";
import {
  getRank,
  getRankScoreMap,
  getTotalScore,
  getWordScore,
} from "../utils";
import WordListCard from "./word-list-card";
import ScoreTracker from "./score-tracker";
import WordListBar from "./word-list-bar";

export default function GameWrapper({
  roundData,
  isLive,
}: {
  roundData: HexRound;
  isLive?: boolean;
}) {
  const { rootWord, centerLetter, words, date } = roundData;
  const parsedWords = useMemo(() => words?.split(",") ?? [], [words]);
  const [playerAnswer, setPlayerAnswer] = useHexAnswer(date);

  const { inputWord, setInputWord, letters } = useHexStore((store) => store);

  const [animate, setAnimate] = useState("");
  const [lastScore, setLastScore] = useState(0);
  const rankMap = useMemo(() => {
    return getRankScoreMap(roundData.maxScore!);
  }, [roundData.maxScore]);

  function animateError() {
    setAnimate("error");
    setTimeout(() => {
      setAnimate("");
      setInputWord("");
    }, 400);
  }

  function submitAnswer() {
    setAnimate("");

    if (inputWord.length < 4) {
      toast.error("Word must be at least 4 letters long.", {
        position: "top-center",
        duration: 1000,
      });
      animateError();
      return;
    }

    if (!inputWord.includes(centerLetter!)) {
      toast.error("Word must include the center letter.", {
        position: "top-center",
        duration: 1000,
      });
      animateError();
      return;
    }

    if (!parsedWords.includes(inputWord)) {
      toast.error("Word not found in word list.", {
        position: "top-center",
        duration: 1000,
      });
      animateError();
      return;
    }

    if (playerAnswer.guessedWords.includes(inputWord)) {
      toast.error("Word already guessed.", {
        position: "top-center",
        duration: 1000,
      });
      animateError();
      return;
    }

    const score = getWordScore(inputWord);
    setLastScore(score);
    setPlayerAnswer((prev) => {
      const roundScore = getTotalScore(prev.guessedWords);
      const rank = getRank(roundScore + score, rankMap);
      const isTopRank = rank?.name === rankMap[rankMap.length - 1].name;

      return {
        ...prev,
        guessedWords: [...prev.guessedWords, inputWord],
        isTopRank,
        ...(isLive
          ? { liveScore: prev.liveScore + score, isTopRankWhileLive: isTopRank }
          : {}),
      };
    });

    setAnimate("success");
    setTimeout(() => {
      setAnimate("");
      setInputWord("");
    }, 400);
  }

  function onKeyDown(event: KeyboardEvent | { key: string }) {
    if (playerAnswer.isRevealed) {
      return;
    }

    if (animate) {
      return;
    }

    setAnimate("");

    if (event.key === "Backspace") {
      setInputWord((inputWord) => inputWord.slice(0, -1));
      return;
    }

    if (event.key === "Enter") {
      submitAnswer();
      return;
    }

    if (
      letters.includes(event.key.toLowerCase()) ||
      event.key.toLowerCase() === centerLetter
    ) {
      setInputWord((inputWord) => inputWord + event.key.toLowerCase());
      return;
    }

    if (event.key.length === 1) {
      setAnimate("error");
      setTimeout(() => {
        setAnimate("");
      }, 500);
    }
  }

  useEventListener("keydown", onKeyDown);

  return (
    <div className="h-full w-full flex-1 lg:flex">
      <div className="grid-rows-[auto_0.5fr_1fr]px-4 grid h-full w-full py-6">
        <ScoreTracker
          wordList={parsedWords}
          guessedWords={playerAnswer.guessedWords}
          isGameOver={playerAnswer.isRevealed}
        />

        <WordListBar date={date} roundData={roundData} />

        <div className="relative mb-8 flex min-h-[60px] flex-col items-center justify-center gap-1 md:gap-16">
          {animate === "success" && (
            <div
              style={{
                left: `${Math.floor(Math.random() * 30) + 30}%`,
              }}
              className="animate-slide-out bg-saltong-purple absolute top-0 z-10 flex size-8 min-w-8 items-center justify-center rounded-full"
            >
              <span className="text-saltong-purple-200 text-lg font-bold">
                +{lastScore}
              </span>
            </div>
          )}
          {inputWord?.length >= 9 ? (
            <span
              className={cn(
                "bg-saltong-purple-200 dark:bg-saltong-purple/30 mx-auto flex w-fit items-center justify-center gap-0.5 rounded-md px-4 py-3 text-3xl font-bold",
                {
                  "text-2xl md:text-3xl": inputWord.length > 12,
                  "animate-wobble bg-red-400 transition-colors dark:bg-red-500":
                    animate === "error",
                  "animate-wiggle bg-saltong-green-400 dark:bg-saltong-green-500":
                    animate === "success",
                }
              )}
            >
              {inputWord.split("").map((letter, index) => (
                <span
                  key={`${letter}-${index}`}
                  className={cn("opacity-80", {
                    "text-saltong-purple": letter === centerLetter,
                  })}
                >
                  {letter.toUpperCase()}
                </span>
              ))}
            </span>
          ) : inputWord?.length ? (
            <div className="flex items-center justify-center gap-0.5">
              {inputWord?.split("").map((letter, index) => (
                <div
                  className={cn(
                    "bg-saltong-purple-200 dark:bg-saltong-purple/30 flex size-[40px] items-center justify-center rounded-lg md:size-[45px]",
                    {
                      "bg-saltong-purple dark:bg-saltong-purple":
                        letter === centerLetter,
                      "animate-wobble bg-red-400 transition-colors dark:bg-red-500":
                        animate === "error",
                      "animate-wiggle bg-saltong-green-400 dark:bg-saltong-green-500":
                        animate === "success",
                    }
                  )}
                  key={`${letter}-${index}`}
                >
                  <span className="text-2xl font-bold select-none md:text-3xl">
                    {letter.toUpperCase()}
                  </span>
                </div>
              ))}
            </div>
          ) : playerAnswer.isRevealed ? null : (
            <span className="text-saltong-purple animate-pulse text-center text-4xl font-bold tracking-tight select-none">
              Type or Click
            </span>
          )}
        </div>

        <div className="flex w-full items-center justify-center">
          <HexKeyboard
            rootWord={rootWord}
            centerLetter={centerLetter}
            onSubmit={submitAnswer}
            onChange={onKeyDown}
            isDisabled={playerAnswer.isRevealed}
          />
        </div>
      </div>
      <WordListCard date={date} roundData={roundData} />
    </div>
  );
}
