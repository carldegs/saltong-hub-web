"use client";
import ShareButton from "@/components/shared/share-button";
import { CopyIcon, Share2Icon } from "lucide-react";
import { useMemo } from "react";
import {
  LetterStatus,
  SaltongMode,
  SaltongRound,
  SaltongUserRound,
  SaltongUserStats,
} from "../../types";
import { getDurationString } from "@/utils/time";
import { toast } from "sonner";
import { SALTONG_CONFIG } from "../../config";
import { getLetterStatusGrid } from "../../utils/getLetterStatusGrid";
import { sendEvent } from "@/lib/analytics";

const getShareDetails = ({
  userRound,
  roundData,
}: {
  userRound: SaltongUserRound;
  roundData: SaltongRound;
}) => {
  const gameSettings = SALTONG_CONFIG.modes[roundData.mode as SaltongMode];
  const title = `${gameSettings.displayName} #${roundData.roundId}`;

  const wordLen = roundData.word.length;
  const gridStatus = getLetterStatusGrid({
    gridStr: userRound.grid ?? "",
    word: roundData.word,
    wordLen,
  });

  let stats = "";

  if (userRound.isCorrect) {
    const timeSolvedInSec =
      userRound.endedAt && userRound.startedAt
        ? Math.floor(
            (new Date(userRound.endedAt).getTime() -
              new Date(userRound.startedAt).getTime()) /
              1000
          )
        : 0;
    stats = `🏅${Math.floor(gridStatus.length / wordLen)} ⏳${getDurationString(
      timeSolvedInSec * 1000
    )}`;
  } else {
    stats = `🏅X/${wordLen}`;
  }

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

  const message = `${title}\n\n${stats}\n\n${grid}\n\n${typeof window !== "undefined" ? window.location.href : ""}`;

  return {
    title,
    message,
  };
};

export default function ShareButtons({
  roundData,
  userRoundData,
}: {
  roundData: SaltongRound;
  userRoundData: SaltongUserRound;
  userStats: SaltongUserStats;
}) {
  const shareDetails = useMemo(
    () =>
      getShareDetails({
        userRound: userRoundData,
        roundData,
      }),
    [userRoundData, roundData]
  );

  const handleShare = async () => {
    sendEvent("saltong_share_results", {
      action: "share",
      mode: roundData.mode,
      date: roundData.date,
      roundId: roundData.roundId,
      isCorrect: userRoundData?.isCorrect,
    });
    try {
      if (navigator.share) {
        await navigator.share({
          // title: shareDetails.title,
          text: shareDetails.message,
        });
      } else {
        await navigator.clipboard.writeText(shareDetails.message);
        toast.success("Copied to clipboard");
      }
    } catch (error) {
      if (error instanceof Error && error.name !== "AbortError") {
        toast.error("Failed to share");
      }
    }
  };

  const handleCopy = async () => {
    sendEvent("saltong_share_results", {
      action: "copy",
      mode: roundData.mode,
      date: roundData.date,
      roundId: roundData.roundId,
      isCorrect: userRoundData?.isCorrect,
    });
    try {
      await navigator.clipboard.writeText(shareDetails.message);
      toast.success("Copied to clipboard");
    } catch {
      toast.error("Failed to copy");
    }
  };
  return (
    <div className="mx-auto flex items-center justify-evenly gap-2">
      <ShareButton
        icon={<Share2Icon />}
        label="Share Results"
        className="w-full min-w-22"
        onClick={handleShare}
      />
      <ShareButton
        icon={<CopyIcon />}
        label="Copy Text"
        className="w-full min-w-22"
        onClick={handleCopy}
      />
    </div>
  );
}
