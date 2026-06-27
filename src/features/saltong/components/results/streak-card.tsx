import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowRightIcon, FlameIcon } from "lucide-react";
import { SaltongUserStats } from "../../types";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { sendEvent } from "@/lib/analytics";

export default function StreakCard({
  username,
  userStats,
}: {
  username: string;
  userStats: SaltongUserStats;
}) {
  const { currentWinStreak, longestWinStreak, totalLosses, totalWins } =
    userStats;
  const streakValue = Number(currentWinStreak ?? 0);
  const streakDigits = String(Math.abs(streakValue)).length;
  const totalGames = Math.max(Number(totalWins) + Number(totalLosses), 0);
  const winRate =
    totalGames > 0 ? Math.round((Number(totalWins) / totalGames) * 100) : 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Your Win Streak</CardTitle>
        <CardAction>
          <Button size="sm" asChild variant="outline">
            <Link
              href={`/u/${username}`}
              onClick={() => {
                sendEvent("button_click", {
                  location: "results_dialog",
                  action: "view_profile",
                  username,
                });
              }}
            >
              More <ArrowRightIcon />
            </Link>
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-6">
          <div className="relative flex w-full items-center justify-center select-none">
            <div
              className={cn(
                "absolute top-16 z-1 flex max-w-[7.5rem] items-center justify-center px-2 text-center font-bold tracking-tighter text-orange-100",
                {
                  "top-[4.25rem] tracking-tight": streakDigits >= 4,
                  "text-primary": !streakValue,
                }
              )}
              style={{
                fontSize: `clamp(1.5rem, calc(7rem / ${Math.max(
                  streakDigits * 0.62,
                  1
                )}), 3.75rem)`,
                WebkitTextStroke: !streakValue
                  ? "0.12em var(--color-muted)"
                  : "0.12em var(--color-orange-500)",
                paintOrder: "stroke fill",
              }}
            >
              {streakValue}
            </div>
            <div className="flex w-full flex-col items-center justify-center gap-1">
              <FlameIcon
                strokeWidth={2}
                className={cn("size-30 text-orange-500", {
                  "text-primary/20": !streakValue,
                })}
                fill={
                  !streakValue
                    ? "var(--color-muted)"
                    : "var(--color-orange-400)"
                }
              />
              <span
                className={cn("text-lg font-black text-orange-500", {
                  "text-primary": !streakValue,
                })}
              >
                DAY{streakValue === 1 ? "" : "S"}
              </span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-6">
            <div className="flex min-w-0 flex-col items-center justify-center text-center">
              <div className="text-xl font-bold tracking-tighter">
                {longestWinStreak}
              </div>
              <div className="text-muted-foreground text-sm">
                Longest Streak
              </div>
            </div>
            <div className="flex min-w-0 flex-col items-center justify-center text-center">
              <div className="text-xl font-bold tracking-tighter">
                {winRate}%
              </div>
              <div className="text-muted-foreground text-sm">Win Rate</div>
            </div>
            <div className="flex min-w-0 flex-col items-center justify-center text-center">
              <div className="text-xl font-bold tracking-tighter">
                {totalWins}
              </div>
              <div className="text-muted-foreground text-sm">Total Wins</div>
            </div>
            <div className="flex min-w-0 flex-col items-center justify-center text-center">
              <div className="text-xl font-bold tracking-tighter">
                {totalLosses}
              </div>
              <div className="text-muted-foreground text-sm">Total Losses</div>
            </div>
          </div>
        </div>
      </CardContent>
      {/* <CardFooter>
        <Button>More Stats</Button>
        <Button>
          <Share2Icon />
          Share
        </Button>
      </CardFooter> */}
    </Card>
  );
}
