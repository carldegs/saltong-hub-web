import { useEffect } from "react";
import { SaltongRound, SaltongUserRound, SaltongUserStats } from "../../types";
import { triggerFailureConfetti, triggerSuccessConfetti } from "./utils";
import { TimeCard } from "./time-card";

export const confettiColors = ["#499AEE", "#E23B3B", "#8759F3", "#38E18C"];

export default function SummaryScreen({
  userRoundData,
}: {
  roundData: SaltongRound;
  userRoundData: SaltongUserRound;
  userStats: SaltongUserStats;
}) {
  useEffect(() => {
    if (userRoundData.isCorrect) {
      triggerSuccessConfetti();
    } else {
      triggerFailureConfetti();
    }
  }, [userRoundData.isCorrect]);

  return (
    <div className="flex items-center justify-center gap-4">
      <TimeCard
        startTime={userRoundData.startedAt}
        endTime={userRoundData.endedAt!}
      />
    </div>
  );
}
