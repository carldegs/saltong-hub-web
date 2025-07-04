"use client";

import {
  SettingsSectionHeader,
  SettingsSectionItem,
  SettingsSectionList,
  SettingsSectionContent,
} from "./settings-section";
import { useCallback, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import usePlayerStats from "@/app/play/(saltong)/hooks/usePlayerStats";
import useRoundAnswers from "@/app/play/(saltong)/hooks/useRoundAnswers";
import useHexAnswers from "@/app/play/hex/hooks/useHexAnswers";

const useGameData = () => {
  const playerStats = usePlayerStats();
  const mainGameData = useRoundAnswers("saltong-main");
  const miniGameData = useRoundAnswers("saltong-mini");
  const maxGameData = useRoundAnswers("saltong-max");
  const hexGameData = useHexAnswers();

  const clearGameData = useCallback(() => {
    playerStats[2]();
    mainGameData[2]();
    miniGameData[2]();
    maxGameData[2]();
    hexGameData[2]();
  }, [hexGameData, mainGameData, maxGameData, miniGameData, playerStats]);

  return {
    clearGameData,
  };
};

export default function SupportSection() {
  const [open, setOpen] = useState(false);
  const handleResetGameData = () => {
    setOpen(true);
  };
  const { clearGameData } = useGameData();

  const handleConfirm = () => {
    setOpen(false);
    clearGameData();
  };

  const handleCancel = () => {
    setOpen(false);
  };
  return (
    <section>
      <SettingsSectionHeader>Support</SettingsSectionHeader>
      <SettingsSectionContent>
        <SettingsSectionList>
          {/* TODO: Setup Bug Reporting Tool */}
          {/* <SettingsSectionItemLink href="/report">
            Report Bug
          </SettingsSectionItemLink> */}
          <SettingsSectionItem>
            <a
              href="mailto:carl@carldegs.com"
              className="flex w-full items-center justify-between gap-2"
            >
              <span>Send Email</span>
              <span className="text-muted-foreground text-sm">
                carl@carldegs.com
              </span>
            </a>
          </SettingsSectionItem>
          <SettingsSectionItem
            onClick={handleResetGameData}
            className="cursor-pointer"
          >
            Reset Game Data
          </SettingsSectionItem>
        </SettingsSectionList>
      </SettingsSectionContent>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="border-none">Reset Game Data</DialogTitle>
          </DialogHeader>

          <span>
            Are you sure you want to reset your game data? This action cannot be
            undone.
          </span>
          <DialogFooter>
            <Button variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              className="bg-red-400 hover:bg-red-500"
              onClick={handleConfirm}
            >
              Reset
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
}
