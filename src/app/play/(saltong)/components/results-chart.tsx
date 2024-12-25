"use client";

import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
} from "recharts";

import { Card, CardContent } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const chartConfig = {
  you: {
    label: "You",
    color: "hsl(var(--chart-1))",
  },
  avg: {
    label: "Average",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

export default function ResultsChart({
  playerStats,
  totalStats,
}: {
  playerStats: number[];
  totalStats?: number[];
}) {
  const chartData = playerStats.map((stat, idx) => ({
    turn: `Turn ${idx + 1}`,
    you: stat,
    avg: totalStats ? totalStats[idx] : 0,
  }));

  return (
    <Card>
      <CardContent className="px-2 pb-0">
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
