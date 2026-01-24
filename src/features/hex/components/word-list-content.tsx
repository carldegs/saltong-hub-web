"use client";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { SortAscIcon, SortDescIcon, StarIcon } from "lucide-react";
import { useMemo, useState } from "react";
import { isPangram } from "../utils";

const SORT_BY_VALUES = ["Guess Order", "Alphabetical", "Word Length"];
const SORT_ORDER_VALUES = ["Ascending", "Descending"];

export default function WordListContent({
  isLoading,
  words,
  numWordsToGuess,
  numLetters = 7,
}: {
  isLoading: boolean;
  words: string[];
  numWordsToGuess: number;
  numLetters?: number;
}) {
  const [sortBy, setSortBy] =
    useState<(typeof SORT_BY_VALUES)[number]>("Guess Order");
  const [sortOrder, setSortOrder] =
    useState<(typeof SORT_ORDER_VALUES)[number]>("Descending");

  const wordList = useMemo(() => {
    // words is guess order ascending by default
    let sortedWords = words;
    if (sortBy === "Alphabetical") {
      sortedWords = words.sort();
    } else if (sortBy === "Word Length") {
      sortedWords = words.sort((a, b) => a.length - b.length);
    } else {
      sortedWords = [...words];
    }

    if (sortOrder === "Descending") {
      sortedWords = sortedWords.reverse();
    }

    return sortedWords;
  }, [sortBy, sortOrder, words]);

  const pangramWordsInList = useMemo(
    () => wordList.filter((word) => isPangram(word, numLetters)),
    [wordList, numLetters]
  );

  return (
    <>
      {!isLoading ? (
        <div className="grid grid-cols-[1fr_2fr_1fr] items-center px-2">
          <div></div>
          <span className="w-full text-center text-lg font-bold tracking-tight opacity-80">
            {wordList.length} of {numWordsToGuess} words found
          </span>
          <div className="flex justify-end">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="secondary">
                  {sortOrder === "Ascending" ? (
                    <SortAscIcon size={16} />
                  ) : (
                    <SortDescIcon size={16} />
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="mr-4">
                <DropdownMenuGroup>
                  <DropdownMenuLabel>Sort by</DropdownMenuLabel>
                  <DropdownMenuRadioGroup
                    value={sortBy}
                    onValueChange={setSortBy}
                  >
                    {SORT_BY_VALUES.map((value) => (
                      <DropdownMenuRadioItem key={value} value={value}>
                        {value}
                      </DropdownMenuRadioItem>
                    ))}
                  </DropdownMenuRadioGroup>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuLabel>Sort Order</DropdownMenuLabel>
                  <DropdownMenuRadioGroup
                    value={sortOrder}
                    onValueChange={setSortOrder}
                  >
                    {SORT_ORDER_VALUES.map((value) => (
                      <DropdownMenuRadioItem key={value} value={value}>
                        {value}
                      </DropdownMenuRadioItem>
                    ))}
                  </DropdownMenuRadioGroup>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      ) : (
        <Skeleton className="mx-6 h-5 w-full" />
      )}
      <div className="grid grid-cols-2 gap-x-2 overflow-auto px-6 pb-6">
        {wordList.map((word) => (
          <span key={word} className="h-fit opacity-80">
            {word}
            {pangramWordsInList.includes(word) && (
              <StarIcon className="-mt-[0.5] ml-1 inline-block size-4 text-yellow-500 dark:text-yellow-400" />
            )}
          </span>
        ))}
      </div>
    </>
  );
}
