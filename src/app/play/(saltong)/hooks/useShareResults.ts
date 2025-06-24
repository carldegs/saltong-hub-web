import { useCallback, useMemo } from "react";
import { RoundStats, PlayerStats, LetterStatus, SaltongRound } from "../types";
import { getLetterStatusGrid } from "../utils";
import { useCopyToClipboard } from "usehooks-ts";
import { toast } from "sonner";
import { getDurationString } from "@/utils/time";
import { GAME_SETTINGS } from "../../constants";

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
    return `${GAME_SETTINGS[playerStats.gameId].name} #${roundData.gameId}`;
  }, [playerStats.gameId, roundData.gameId]);

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

    // Pad gridStatus to have n rows equal to maxTries
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
      `${GAME_SETTINGS[playerStats.gameId].name} #${roundData.gameId}\n\n${shareMessage}\n\n${window.location.href}`
    );
    toast.success("Results copied to clipboard!");
  }, [copyToClipboard, playerStats.gameId, roundData.gameId, shareMessage]);

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
