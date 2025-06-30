"use client";

import { ChevronDownIcon } from "lucide-react";
import { HexAnswerData, HexRound } from "../types";
import { useMemo, useState, useRef, RefObject } from "react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import WordListContent from "./word-list-content";
import { useDebounceCallback, useResizeObserver } from "usehooks-ts";

export default function WordListBar({
  roundData,
  playerAnswer,
  isInit,
}: {
  roundData: HexRound;
  playerAnswer: HexAnswerData;
  isInit: boolean;
}) {
  const { numWords } = roundData;
  const wordList = useMemo(
    () => [...playerAnswer.guessedWords.reverse()],
    [playerAnswer.guessedWords]
  );

  const containerRef = useRef<HTMLDivElement>(null);
  const [{ width: containerWidth = 0 }, setSize] = useState<{ width: number }>({
    width: 0,
  });

  const onResize = useDebounceCallback((size: { width: number }) => {
    setSize(size);
  }, 200);

  useResizeObserver({
    ref: containerRef as RefObject<HTMLElement>,
    onResize: (size) => {
      onResize({
        width: size.width ?? 0,
      });
    },
  });

  const visibleWords = useMemo(() => {
    let totalWidth = 0;
    return wordList.filter((word) => {
      const wordWidth = word.length * 13; // Approximate width calculation
      if (totalWidth + wordWidth < containerWidth) {
        totalWidth += wordWidth;
        return true;
      }
      return false;
    });
  }, [wordList, containerWidth]);

  return (
    <div
      ref={containerRef}
      className="word-list-bar mx-auto w-full max-w-[600px] overflow-hidden px-4 lg:hidden"
    >
      {isInit && (
        <Popover>
          <PopoverTrigger asChild>
            <div className="border-foreground relative mt-4 flex min-h-[50px] w-full cursor-pointer flex-nowrap gap-2 overflow-hidden rounded-md border px-4 py-3">
              {visibleWords.map((word) => (
                <span key={word} className="">
                  {word}
                </span>
              ))}
              <button className="absolute top-0 right-0 h-full w-8">
                <ChevronDownIcon size={24} />
              </button>
            </div>
          </PopoverTrigger>
          <PopoverContent className="block w-full border-none bg-transparent p-2 shadow-none lg:hidden">
            <div className="bg-background mx-auto w-full border p-4 shadow-md">
              <WordListContent
                isLoading={!isInit}
                words={playerAnswer.guessedWords}
                numWordsToGuess={numWords ?? 0}
              />
            </div>
          </PopoverContent>
        </Popover>
      )}
    </div>
  );
}
