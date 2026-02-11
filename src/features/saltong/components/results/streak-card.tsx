import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FlameIcon } from "lucide-react";
import { SaltongUserStats } from "../../types";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function StreakCard({
  username,
  userStats,
}: {
  username: string;
  userStats: SaltongUserStats;
}) {
  const { currentWinStreak, longestWinStreak, totalLosses, totalWins } =
    userStats;
  const totalGames = Math.max(Number(totalWins) + Number(totalLosses), 0);
  const winRate =
    totalGames > 0 ? Math.round((Number(totalWins) / totalGames) * 100) : 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Your Win Streak</CardTitle>
        <CardAction>
          <Button size="sm" asChild>
            <Link href={`/u/${username}`}>More Stats</Link>
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 grid-rows-2">
          <div className="relative row-span-2 flex w-full items-center justify-center select-none">
            <div
              className={cn(
                "absolute top-16 z-1 flex w-full items-center justify-center text-6xl font-bold tracking-tighter text-orange-100",
                {
                  "top-19 text-5xl tracking-tight":
                    Number(currentWinStreak) >= 1000,
                  "text-primary": !currentWinStreak,
                }
              )}
              style={{
                WebkitTextStroke: !currentWinStreak
                  ? "10px var(--color-muted)"
                  : "10px var(--color-orange-500)",
                paintOrder: "stroke fill",
              }}
            >
              {currentWinStreak ?? 0}
            </div>
            <div className="flex w-full flex-col items-center justify-center gap-1">
              <FlameIcon
                strokeWidth={2}
                className={cn("size-30 text-orange-500", {
                  "text-primary/20": !currentWinStreak,
                })}
                fill={
                  !currentWinStreak
                    ? "var(--color-muted)"
                    : "var(--color-orange-400)"
                }
              />
              <span
                className={cn("text-lg font-black text-orange-500", {
                  "text-primary": !currentWinStreak,
                })}
              >
                DAY{Number(currentWinStreak) === 1 ? "" : "S"}
              </span>
            </div>
          </div>
          <div className="flex flex-col items-center justify-center">
            <div className="text-xl font-bold tracking-tighter">
              {longestWinStreak}
            </div>
            <div className="text-muted-foreground text-sm">Longest Streak</div>
          </div>
          <div className="flex flex-col items-center justify-center">
            <div className="text-xl font-bold tracking-tighter">{winRate}%</div>
            <div className="text-muted-foreground text-sm">Win Rate</div>
          </div>
          <div className="flex flex-col items-center justify-center">
            <div className="text-xl font-bold tracking-tighter">
              {totalWins}
            </div>
            <div className="text-muted-foreground text-sm">Total Wins</div>
          </div>
          <div className="flex flex-col items-center justify-center">
            <div className="text-xl font-bold tracking-tighter">
              {totalLosses}
            </div>
            <div className="text-muted-foreground text-sm">Total Losses</div>
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
