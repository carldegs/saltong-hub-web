"use client";

import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
} from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useMemo } from "react";

const chartConfig = {
  you: {
    label: "You",
    color: "var(--chart-1)",
  },
  avg: {
    label: "Average",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

export default function ResultsChart({
  playerStats,
  totalStats,
  className,
}: {
  playerStats: number[];
  totalStats?: number[];
  className?: string;
}) {
  const chartData = useMemo(
    () =>
      playerStats.map((stat, idx) => ({
        turn: `Turn ${idx + 1}`,
        you: stat,
        avg: totalStats ? totalStats[idx] : undefined,
      })),
    [playerStats, totalStats]
  );

  const avgTurnsToWin = useMemo(() => {
    const totalWinTurns = !playerStats
      ? 0
      : (playerStats as number[])?.reduce(
          (prev, curr, i) => prev + curr * (i + 1),
          0
        ) || 0;

    const totalWins = playerStats.reduce((prev, curr) => prev + curr, 0);
    return playerStats ? totalWinTurns / totalWins : undefined;
  }, [playerStats]);

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Turns To Win</CardTitle>
        {!!avgTurnsToWin && (
          <CardDescription>
            On average, you win at <b>Turn {Math.round(avgTurnsToWin)}</b>
          </CardDescription>
        )}
      </CardHeader>
      <CardContent className="relative px-2 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[350px]"
        >
          <RadarChart data={chartData}>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <PolarAngleAxis dataKey="turn" />
            <PolarGrid />
            <Radar
              dataKey="avg"
              fill="var(--color-avg)"
              stroke="var(--color-avg)"
              strokeWidth={2}
              dot={{
                r: 4,
                fillOpacity: 1,
              }}
              opacity={0.5}
            />
            <Radar
              dataKey="you"
              fill="var(--color-you)"
              fillOpacity={0.6}
              stroke="var(--color-you)"
              strokeWidth={2}
              dot={{
                r: 4,
                fillOpacity: 1,
              }}
            />
            <PolarRadiusAxis
              angle={60}
              stroke="hsla(var(--foreground))"
              opacity={0.5}
              orientation="middle"
              axisLine={false}
            />
          </RadarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
