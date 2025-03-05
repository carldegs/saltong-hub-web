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
import { getWordScore } from "../utils";
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
      return {
        ...prev,
        guessedWords: [...prev.guessedWords, inputWord],
        ...(isLive ? { liveScore: prev.liveScore + score } : {}),
      };
    });

    setAnimate("success");
    setTimeout(() => {
      setAnimate("");
      setInputWord("");
    }, 400);
  }

  function onKeyDown(event: KeyboardEvent | { key: string }) {
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
        />

        <WordListBar date={date} roundData={roundData} />

        <div className="relative mb-8 flex min-h-[60px] flex-col items-center justify-center gap-1 md:gap-16">
          {animate === "success" && (
            <div
              style={{
                left: `${Math.floor(Math.random() * 30) + 30}%`,
              }}
              className="absolute top-0 z-10 flex size-8 min-w-8 animate-slide-out items-center justify-center rounded-full bg-saltong-purple"
            >
              <span className="text-lg font-bold text-saltong-purple-200">
                +{lastScore}
              </span>
            </div>
          )}
          {inputWord?.length >= 9 ? (
            <span
              className={cn(
                "mx-auto flex w-fit items-center justify-center gap-0.5 rounded-md bg-saltong-purple-200 px-4 py-3 text-3xl font-bold dark:bg-saltong-purple/30",
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
                    "flex size-[40px] items-center justify-center rounded-lg bg-saltong-purple-200 dark:bg-saltong-purple/30 md:size-[45px]",
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
                  <span className="select-none text-2xl font-bold md:text-3xl">
                    {letter.toUpperCase()}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <span className="animate-pulse select-none text-center text-4xl font-bold tracking-tight text-saltong-purple">
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
          />
        </div>
      </div>
      <WordListCard date={date} roundData={roundData} />
    </div>
  );
}
