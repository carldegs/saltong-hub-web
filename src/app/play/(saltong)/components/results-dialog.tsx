import {
  Credenza,
  CredenzaBody,
  CredenzaContent,
  CredenzaHeader,
  CredenzaTitle,
  RootCredenzaProps,
} from "@/components/ui/credenza";
import { GameMode, PlayerStats, RoundStats } from "../types";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useMemo } from "react";
import { differenceInDays, intervalToDuration } from "date-fns";
import usePlayerStats from "../hooks/usePlayerStats";
import useRoundStats from "../hooks/useRoundStats";
import ResultsChart from "./results-chart";

function ResultsDialogComponent({
  open,
  onOpenChange,
  roundStats,
  playerStats,
}: Omit<RootCredenzaProps, "children"> & {
  roundStats: RoundStats;
  playerStats: PlayerStats;
}) {
  const { isCorrect, time } = roundStats;
  const { numWins, winRate, winStreak, longestWinStreak } = playerStats;

  const statBarData = useMemo(() => {
    const interval = { start: 0, end: time };
    const baseDuration = intervalToDuration(interval);
    const diffInDays = differenceInDays(interval.end, interval.start);
    const duration = {
      d: diffInDays,
      h: baseDuration.hours,
      m: baseDuration.minutes,
      s: baseDuration.seconds,
    };

    const timeStr = Object.entries(duration)
      .filter(([, value]) => value && value > 0)
      .map(([key, value]) => `${value}${key}`)
      .join(" ");

    return [
      {
        title: "Total Wins",
        value: numWins,
      },
      {
        title: "Win Rate",
        value: (winRate * 100).toFixed(0) + "%",
      },
      {
        title: "Win Streak",
        value: winStreak,
      },
      {
        title: "Max Streak",
        value: longestWinStreak,
      },
      {
        title: "Time",
        value: timeStr || "0s",
      },
    ];
  }, [longestWinStreak, numWins, time, winRate, winStreak]);

  return (
    <Credenza open={open} onOpenChange={onOpenChange}>
      <CredenzaContent>
        <CredenzaHeader className="px-0">
          <CredenzaTitle className="mb-2 border-0 font-bold">
            {isCorrect ? "SOLVED!" : "YOU LOSE"}
          </CredenzaTitle>
        </CredenzaHeader>
        <CredenzaBody className="flex flex-col gap-3">
          <div className="flex flex-wrap gap-3">
            {statBarData.map((data) => (
              <Card
                key={data.title}
                className="min-w-[90px] flex-grow p-0 shadow-none"
              >
                <CardHeader className="p-3">
                  <CardTitle>{data.value}</CardTitle>
                  <CardDescription>{data.title}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
          <ResultsChart />
        </CredenzaBody>
      </CredenzaContent>
    </Credenza>
  );
}

export default function ResultsDialog({
  open,
  onOpenChange,
  mode,
  gameDate,
}: Omit<RootCredenzaProps, "children"> & {
  mode: GameMode;
  gameDate: string;
}) {
  const playerStats = usePlayerStats(mode);
  const roundStats = useRoundStats(mode, gameDate);

  if (open) {
    return (
      <ResultsDialogComponent
        open={open}
        onOpenChange={onOpenChange}
        roundStats={roundStats}
        playerStats={playerStats}
      />
    );
  }

  return null;
}
