"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { BadgeQuestionMarkIcon } from "lucide-react";
import { useState } from "react";
import { useIsClient, useLocalStorage } from "usehooks-ts";
import { HOW_TO_PLAY_INTROS } from "@/features/game-registry/how-to-play-copy";
import type { MathinikOperator } from "../utils";
import {
  MathinikStaticBox,
  MathinikTargetPentagon,
  NumberValue,
} from "./mathinik-display";

function MathinikExampleEquation({
  variable,
  first,
  operator,
  second,
  result,
  emphatic,
}: {
  variable: string;
  first: number;
  operator: MathinikOperator;
  second: number;
  result: number;
  emphatic?: boolean;
}) {
  return (
    <div className="bg-background/80 grid grid-cols-[1.5rem_1fr] items-center gap-1.5 rounded-lg border p-2 sm:grid-cols-[2rem_1fr] sm:gap-2 sm:p-3">
      <div className="text-muted-foreground text-center text-lg font-black sm:text-xl">
        {variable}
      </div>
      <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2">
        <MathinikStaticBox>
          <NumberValue value={first} />
        </MathinikStaticBox>
        <MathinikStaticBox>{operator}</MathinikStaticBox>
        <MathinikStaticBox>
          <NumberValue value={second} />
        </MathinikStaticBox>
        <span className="text-saltong-teal font-black">=</span>
        <MathinikStaticBox muted>
          <NumberValue
            value={result}
            label={
              emphatic ? <span className="text-yellow-500">✓</span> : variable
            }
          />
        </MathinikStaticBox>
      </div>
    </div>
  );
}

export function MathinikHowToPlayDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const isClient = useIsClient();
  const [hasSeenHowToPlay, setHasSeenHowToPlay] = useLocalStorage(
    "mathinik-has-seen-how-to-play",
    false,
    { initializeWithValue: false }
  );
  const open = isOpen || (isClient && !hasSeenHowToPlay);

  const handleOpenChange = (nextOpen: boolean) => {
    if (!hasSeenHowToPlay) {
      setHasSeenHowToPlay(true);
    }
    setIsOpen(nextOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" size="respIcon">
          <BadgeQuestionMarkIcon />
          <span className="hidden md:block">How to Play</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="decoration-0">
            How to Play Mathinik
          </DialogTitle>
        </DialogHeader>
        <div className="no-scrollbar -mx-4 max-h-[60vh] overflow-y-auto px-4">
          <div className="space-y-6">
            <section>
              <p className="text-muted-foreground text-sm leading-6">
                {HOW_TO_PLAY_INTROS.mathinik}
              </p>
            </section>

            <section className="space-y-3">
              <h3 className="text-lg font-black">Example</h3>
              <div className="rounded-lg border p-3 sm:p-4">
                <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
                  {[1, 3, 5, 9, 10, 50].map((value) => (
                    <MathinikStaticBox key={value}>
                      <NumberValue value={value} />
                    </MathinikStaticBox>
                  ))}
                  <MathinikTargetPentagon target={898} className="h-16 w-26" />
                </div>
              </div>
            </section>

            <section className="space-y-3">
              <h3 className="text-lg font-black">To reach the target</h3>
              <div className="space-y-2">
                <MathinikExampleEquation
                  variable="α"
                  first={50}
                  operator="÷"
                  second={5}
                  result={10}
                />
                <p className="text-muted-foreground px-1 text-sm leading-6">
                  Combining 50 and 5 this way gives another 10 to use.
                </p>
                <MathinikExampleEquation
                  variable="β"
                  first={10}
                  operator="×"
                  second={10}
                  result={100}
                />
                <MathinikExampleEquation
                  variable="γ"
                  first={100}
                  operator="×"
                  second={9}
                  result={900}
                />
                <MathinikExampleEquation
                  variable="δ"
                  first={3}
                  operator="-"
                  second={1}
                  result={2}
                />
                <MathinikExampleEquation
                  variable="ε"
                  first={900}
                  operator="-"
                  second={2}
                  result={898}
                  emphatic
                />
              </div>
            </section>

            <section className="space-y-3">
              <h3 className="text-lg font-black">Rules</h3>
              <div className="divide-border overflow-hidden rounded-lg border text-sm">
                {[
                  ["Use once", "Each number can only be used once."],
                  [
                    "Positive whole numbers",
                    "Only positive and whole numbers are allowed.",
                  ],
                  [
                    "Clean division",
                    "Division only works when there is no remainder. You cannot do 5 ÷ 2.",
                  ],
                ].map(([rule, description]) => (
                  <div
                    key={rule}
                    className="grid grid-cols-[8rem_1fr] divide-x"
                  >
                    <div className="p-3 font-bold">{rule}</div>
                    <div className="text-muted-foreground p-3">
                      {description}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
        <DialogFooter className="border-t px-6 py-4">
          <DialogClose asChild>
            <Button className="w-full" variant="outline">
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
