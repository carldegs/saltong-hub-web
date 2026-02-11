"use client";

import { Separator } from "@/components/ui/separator";
import type { SaltongHowToPlayExample } from "../../types";
import SaltongGrid from "../saltong-grid";

type ExampleDefinition = SaltongHowToPlayExample;

type SaltongHowToPlayCardProps = {
  displayName: string;
  maxTries: number;
  wordLen: number;
  examples: ExampleDefinition[];
};

export function SaltongHowToPlayCard({
  displayName,
  maxTries,
  wordLen,
  examples,
}: SaltongHowToPlayCardProps) {
  const gameLabel = displayName.toUpperCase();

  return (
    <div>
      <div className="space-y-1">
        <h3 className="text-lg font-semibold">How to Play</h3>
        <p className="text-muted-foreground text-sm">
          Guess the {gameLabel} word in {maxTries} tries. Each guess must be a
          valid {wordLen}-letter word—press Enter to submit.
        </p>
        <p className="text-muted-foreground text-sm">
          After each guess, the color of the tiles will change to show how close
          your guess was to the word.
        </p>
      </div>
      <div className="mt-4 space-y-3">
        <div className="text-foreground text-sm font-semibold tracking-wide uppercase">
          Examples
        </div>
        {examples.map((example) => (
          <ExampleRow key={example.word} {...example} />
        ))}
      </div>
      <Separator className="my-4" />
      <p className="text-muted-foreground text-sm">
        A new word will be available each day.
      </p>
    </div>
  );
}

function ExampleRow({ word, statuses, description }: ExampleDefinition) {
  const normalizedWord = word.toUpperCase();
  const statusString = statuses.join("");

  return (
    <div className="space-y-2">
      <SaltongGrid
        maxTries={1}
        wordLen={normalizedWord.length}
        grid={normalizedWord}
        status={statusString}
        disabled
        loaderType="skeleton"
      />
      <p className="text-muted-foreground m-0 text-sm">{description}</p>
    </div>
  );
}
