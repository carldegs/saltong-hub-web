"use client";

import {
  Label,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
} from "recharts";

import { ChartContainer, type ChartConfig } from "@/components/ui/chart";

type WinRateChartProps = {
  totalWins?: number;
  totalLosses?: number;
};

const chartConfig = {
  winRate: {
    label: "Win Rate",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

export function WinRateChart({
  totalWins = 0,
  totalLosses = 0,
}: WinRateChartProps) {
  const totalGames = Math.max(totalWins + totalLosses, 0);
  const winRate =
    totalGames > 0 ? Math.round((totalWins / totalGames) * 100) : 0;

  const chartData = [
    {
      name: "Win Rate",
      winRate,
      fill: "var(--color-winRate)",
    },
  ];

  return (
    <ChartContainer
      config={chartConfig}
      className="mx-auto aspect-square max-h-[250px]"
    >
      <RadialBarChart
        data={chartData}
        startAngle={90}
        endAngle={450}
        innerRadius={80}
        outerRadius={110}
      >
        <PolarGrid
          gridType="circle"
          radialLines={false}
          stroke="none"
          className="first:fill-muted last:fill-background"
          polarRadius={[86, 74]}
        />
        <PolarAngleAxis
          type="number"
          domain={[0, 100]}
          dataKey="winRate"
          tick={false}
        />
        <RadialBar dataKey="winRate" cornerRadius={10} background />
        <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
          <Label
            content={({ viewBox }) => {
              if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                return (
                  <text
                    x={viewBox.cx}
                    y={viewBox.cy}
                    textAnchor="middle"
                    dominantBaseline="middle"
                  >
                    <tspan
                      x={viewBox.cx}
                      y={viewBox.cy}
                      className="fill-foreground text-4xl font-bold"
                    >
                      {`${winRate}%`}
                    </tspan>
                    <tspan
                      x={viewBox.cx}
                      y={(viewBox.cy || 0) + 24}
                      className="fill-muted-foreground"
                    >
                      {totalGames ? "Win Rate" : "No games yet"}
                    </tspan>
                  </text>
                );
              }
              return null;
            }}
          />
        </PolarRadiusAxis>
      </RadialBarChart>
    </ChartContainer>
  );
}
