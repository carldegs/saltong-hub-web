"use client";

import { TrendingUp } from "lucide-react";
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
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const chartData = [
  { turn: "Turn 1", you: 18, avg: 8 },
  { turn: "Turn 2", you: 30, avg: 20 },
  { turn: "Turn 3", you: 23, avg: 12 },
  { turn: "Turn 4", you: 7, avg: 19 },
  { turn: "Turn 5", you: 20, avg: 13 },
  { turn: "Turn 6", you: 15, avg: 15 },
  { turn: "Turn 7", you: 10, avg: 10 },
  { turn: "Turn 8", you: 5, avg: 5 },
];

const chartConfig = {
  you: {
    label: "You",
    color: "hsl(var(--chart-2))",
  },
  avg: {
    label: "Average",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

export default function ResultsChart() {
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
            {/* <Radar
              dataKey="avg"
              fill="var(--color-avg)"
              fillOpacity={0.6}
              stroke="var(--color-avg)"
              strokeWidth={2}
              dot={{
                r: 4,
                fillOpacity: 1,
              }}
            /> */}
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
