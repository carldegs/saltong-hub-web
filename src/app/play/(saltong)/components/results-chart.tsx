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
import { Button } from "@/components/ui/button";
import { HelpCircleIcon } from "lucide-react";

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
}: {
  playerStats: number[];
  totalStats?: number[];
}) {
  const chartData = playerStats.map((stat, idx) => ({
    turn: `Turn ${idx + 1}`,
    you: stat,
    avg: totalStats ? totalStats[idx] : undefined,
  }));

  return (
    <Card>
      <CardContent className="relative px-2 pb-0">
        <Button size="icon" variant="ghost" className="absolute -top-3 right-4">
          <HelpCircleIcon size={20} />
        </Button>
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
