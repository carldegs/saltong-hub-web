"use client";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { BadgeQuestionMarkIcon } from "lucide-react";
import { SaltongHowToPlayCard } from "./card";
import { SALTONG_CONFIG } from "../../config";
import { SaltongMode } from "../../types";
import { useModalStore } from "@/providers/modal/modal-provider";
import { useLocalStorage } from "usehooks-ts";
import { useEffect } from "react";

export const HOW_TO_PLAY_MODAL_ID = "how-to-play";

export default function HowToPlayDialog({ mode }: { mode: SaltongMode }) {
  const isOpen = useModalStore(
    (state) => state.openModal === HOW_TO_PLAY_MODAL_ID
  );
  const setOpenModal = useModalStore((state) => state.setOpenModal);

  const { displayName, maxTries, wordLen, howToPlayExamples } =
    SALTONG_CONFIG.modes[mode as keyof typeof SALTONG_CONFIG.modes];
  const [hasSeenHowToPlay, setHasSeenHowToPlay] = useLocalStorage(
    `saltong-results-has-seen-how-to-play-${mode}`,
    false
  );

  useEffect(() => {
    if (isOpen && !hasSeenHowToPlay) {
      setHasSeenHowToPlay(true);
    }
  }, [isOpen, hasSeenHowToPlay, setHasSeenHowToPlay]);

  useEffect(() => {
    if (!hasSeenHowToPlay && !isOpen) {
      setOpenModal(HOW_TO_PLAY_MODAL_ID);
    }
  }, [hasSeenHowToPlay, isOpen, setOpenModal]);

  return (
    <Sheet
      open={isOpen}
      onOpenChange={(open) => setOpenModal(open ? HOW_TO_PLAY_MODAL_ID : null)}
    >
      <SheetTrigger asChild>
        <Button variant="outline" size="respIcon">
          <BadgeQuestionMarkIcon />
          <span className="hidden md:block">How to Play</span>
        </Button>
      </SheetTrigger>
      <SheetContent
        side="bottom"
        className="grid h-dvh grid-rows-[1fr_auto] overflow-y-auto p-0"
      >
        <SheetHeader className="sr-only">
          <SheetTitle>How to Play</SheetTitle>
        </SheetHeader>
        <div className="no-scrollbar mx-auto max-w-lg overflow-y-auto px-4 pt-6 pb-16">
          <SaltongHowToPlayCard
            displayName={displayName}
            maxTries={maxTries}
            wordLen={wordLen}
            examples={howToPlayExamples}
          />
        </div>
        <SheetFooter className="mx-auto w-full max-w-lg px-4 pt-2 pb-4">
          <SheetClose asChild>
            <Button className="w-full" variant="outline">
              Close
            </Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
