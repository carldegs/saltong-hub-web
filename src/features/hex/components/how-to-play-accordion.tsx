"use client";

import { ReactNode, useMemo } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { badgeVariants } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { HEX_CONFIG } from "../config";
import { HOW_TO_PLAY_INTROS } from "@/features/game-registry/how-to-play-copy";
import { HEX_HOW_TO_PLAY_COPY } from "../how-to-play-copy";

export type HexHowToPlayAccordionProps = {
  wordCount: number;
  maxScore: number;
  numPangrams: number;
  onOpenProgressTab: () => void;
};

type AccordionItemConfig = {
  value: string;
  title: string;
  content: ReactNode;
};

const BATHALA_ICON =
  HEX_CONFIG.ranks.find((rank) => rank.name === "bathala")?.icon ?? "⚡";

type BathalaTagProps = {
  className?: string;
};

function BathalaTag({ className = "" }: BathalaTagProps) {
  return (
    <span
      className={cn(
        badgeVariants({ variant: "outline" }),
        "bg-background/60 inline-flex items-center gap-1 border-dashed tracking-widest uppercase",
        className
      )}
    >
      <span aria-hidden="true">{BATHALA_ICON}</span>
      <span className="font-semibold">Bathala</span>
    </span>
  );
}

export default function HexHowToPlayAccordion({
  wordCount,
  maxScore,
  numPangrams,
  onOpenProgressTab,
}: HexHowToPlayAccordionProps) {
  const accordionItems = useMemo<AccordionItemConfig[]>(
    () => [
      {
        value: "rules-scoring",
        title: "Rules & Scoring",
        content: (
          <div className="space-y-4 text-sm">
            <p className="text-muted-foreground">{HOW_TO_PLAY_INTROS.hex}</p>
            <div>
              <p className="text-foreground font-semibold">How to play</p>
              <ul className="mt-1 list-disc space-y-1 pl-5">
                {HEX_HOW_TO_PLAY_COPY.rules.slice(0, 4).map((rule) => (
                  <li key={rule}>{rule}</li>
                ))}
                <li>
                  {HEX_HOW_TO_PLAY_COPY.rules[4]} so keep pushing for new finds
                  until you reach <BathalaTag className="ml-1" />.
                </li>
              </ul>
            </div>
            <div>
              <p className="text-foreground font-semibold">Earning points</p>
              <ul className="mt-1 list-disc space-y-1 pl-5">
                {HEX_HOW_TO_PLAY_COPY.scoring.map((rule) => (
                  <li key={rule}>{rule}</li>
                ))}
              </ul>
              <p className="text-muted-foreground mt-2">
                {HEX_HOW_TO_PLAY_COPY.pangramExplanation}
              </p>
            </div>
            <Alert className="bg-muted">
              <AlertTitle className="text-foreground">Example</AlertTitle>
              <AlertDescription className="text-foreground space-y-2">
                <p>
                  Given the letters{" "}
                  <b>{HEX_HOW_TO_PLAY_COPY.example.letters}</b> with{" "}
                  <b>{HEX_HOW_TO_PLAY_COPY.example.centerLetter}</b> as the
                  center letter:
                </p>
                <ul className="mt-2 list-disc space-y-1 pl-5">
                  {HEX_HOW_TO_PLAY_COPY.example.entries.map((entry) => (
                    <li key={entry.word}>
                      <b>{entry.word}</b> {entry.description}
                    </li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          </div>
        ),
      },
      {
        value: "rankings",
        title: "Rankings",
        content: (
          <div className="space-y-2 text-sm">
            <p>
              Rankings track your progress from the early tiers up to{" "}
              <BathalaTag className="ml-2" />. Want to see the full ladder?
            </p>
            <Button
              variant="link"
              className="px-0 underline"
              onClick={onOpenProgressTab}
            >
              Open Your Progress
            </Button>
          </div>
        ),
      },
      {
        value: "hints",
        title: "Hints",
        content: (
          <div className="space-y-3 text-sm">
            <div className="border-border bg-background/80 rounded-md border p-3">
              <dl className="grid gap-2">
                <div className="flex items-center justify-between">
                  <dt className="text-muted-foreground">Number of words</dt>
                  <dd className="text-foreground font-semibold">{wordCount}</dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-muted-foreground">Points</dt>
                  <dd className="text-foreground font-semibold">{maxScore}</dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-muted-foreground">Number of pangrams</dt>
                  <dd className="text-foreground font-semibold">
                    {numPangrams}
                  </dd>
                </div>
              </dl>
            </div>
            <div>
              <p className="text-foreground font-semibold">Tips</p>
              <ul className="mt-1 list-disc space-y-1 pl-5">
                <li>There can be more than one pangram.</li>
                <li>The shuffle button is your friend.</li>
                <li>
                  Spot common patterns that expand easily (BA → BABA → BABABA).
                </li>
                <li>
                  Look for prefixes/suffixes you can tack on (i-, -in, -an).
                </li>
              </ul>
            </div>
          </div>
        ),
      },
      {
        value: "issues",
        title: "Issues?",
        content: (
          <div className="space-y-2 text-sm">
            <p>
              Experienced issues or missing words? Email
              <a
                href="mailto:carl@carldegs.com"
                className="text-foreground underline"
              >
                {" "}
                carl@carldegs.com
              </a>
              .
            </p>
          </div>
        ),
      },
    ],
    [maxScore, numPangrams, onOpenProgressTab, wordCount]
  );

  return (
    <Accordion type="single" collapsible defaultValue="rules-scoring">
      {accordionItems.map((item) => (
        <AccordionItem key={item.value} value={item.value}>
          <AccordionTrigger>{item.title}</AccordionTrigger>
          <AccordionContent>{item.content}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
