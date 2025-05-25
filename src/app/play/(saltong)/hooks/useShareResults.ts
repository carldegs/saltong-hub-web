import { useCallback, useMemo } from "react";
import { RoundStats, PlayerStats, LetterStatus, SaltongRound } from "../types";
import { getLetterStatusGrid } from "../utils";
import { useCopyToClipboard } from "usehooks-ts";
import { toast } from "sonner";
import { SALTONG_CONFIGS } from "../constants";
import { getDurationString } from "@/utils/time";

export default function useShareResults({
  roundStats,
  playerStats,
  roundData,
}: {
  roundStats: RoundStats;
  playerStats: PlayerStats;
  gameDate: string;
  roundData: SaltongRound;
}) {
  const [, copyToClipboard] = useCopyToClipboard();

  const shareTitle = useMemo(() => {
    return `Saltong ${SALTONG_CONFIGS[playerStats.gameMode].subtitle} #${roundData.gameId}`;
  }, [playerStats.gameMode, roundData.gameId]);

  const shareMessage = useMemo(() => {
    const wordLen = roundData.word.length;
    const gridStatus = getLetterStatusGrid({
      gridStr: roundStats.round.grid,
      word: roundData.word,
      wordLen,
    });

    let stats = "";

    if (roundStats.isCorrect) {
      stats = `🏅${Math.floor(gridStatus.length / wordLen)} ⏳${getDurationString((roundStats.timeSolvedInSec ?? 0) * 1000)}`;
    } else {
      stats = `🏅X/${wordLen}`;
    }

    // Pad gridStatus to have n rows equal to SALTONG_CONFIGS[playerStats.gameMode].maxTries
    const chunkedGridStatus = [];
    for (let i = 0; i < gridStatus.length; i += wordLen) {
      chunkedGridStatus.push(gridStatus.slice(i, i + wordLen));
    }

    const grid = chunkedGridStatus
      .join("\n")
      .replaceAll(LetterStatus.Correct, "🟩")
      .replaceAll(LetterStatus.Incorrect, "⬛")
      .replaceAll(LetterStatus.Empty, "⬛")
      .replaceAll(LetterStatus.Partial, "🟨");

    return `${stats}\n\n${grid}\n\n${window.location.href}`;
  }, [
    roundData.word,
    roundStats.isCorrect,
    roundStats.round.grid,
    roundStats.timeSolvedInSec,
  ]);

  const canShare = useMemo(() => !!window?.navigator?.canShare, []);

  const shareResults = useCallback(() => {
    return window?.navigator?.share({
      title: shareTitle,
      text: shareMessage,
    });
  }, [shareMessage, shareTitle]);

  const copyResults = useCallback(() => {
    copyToClipboard(
      `Saltong ${SALTONG_CONFIGS[playerStats.gameMode].subtitle} #${roundData.gameId}\n\n${shareMessage}\n\n${window.location.href}`
    );
    toast.success("Results copied to clipboard!");
  }, [copyToClipboard, playerStats.gameMode, roundData.gameId, shareMessage]);

  return useMemo(
    () => ({
      shareResults,
      copyResults,
      canShare,
      shareTitle,
      shareMessage,
    }),
    [canShare, copyResults, shareMessage, shareResults, shareTitle]
  );
}
