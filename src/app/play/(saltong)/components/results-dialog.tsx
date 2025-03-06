import { RootCredenzaProps } from "@/components/ui/credenza";
import { GameMode, PlayerStats, RoundStats } from "../types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useMemo, useState } from "react";
import { differenceInDays, intervalToDuration } from "date-fns";
import usePlayerStats from "../hooks/usePlayerStats";
import useRoundStats from "../hooks/useRoundStats";
import ResultsChart from "./results-chart";
import { SALTONG_CONFIGS } from "../constants";
import Image from "next/image";
import Link from "next/link";
import { ArchiveIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useInterval } from "usehooks-ts";
import useRoundAnswers from "../hooks/useRoundAnswers";
import { getFormattedDateInPh } from "@/utils/time";

const OTHER_GAMES_LIST = [
  {
    mode: "main",
    name: "Saltong",
    icon: "/main.svg",
    href: "/play",
  },
  {
    mode: "max",
    name: "Saltong Max",
    icon: "/max.svg",
    href: "/play/max",
  },
  {
    mode: "mini",
    name: "Saltong Mini",
    icon: "/mini.svg",
    href: "/play/mini",
  },
  {
    mode: "hex",
    name: "Saltong Hex",
    icon: "/hex.svg",
    href: "/play/hex",
  },
];

const STATUS_TEXT: Record<RoundStats["status"], string> = {
  correct: "SOLVED!",
  incorrect: "YOU LOSE",
  partial: "Still Guessing...",
  idle: "Start Guessing!",
};

function TimeCard({ mode, gameDate }: { mode: GameMode; gameDate: string }) {
  const [rounds] = useRoundAnswers(mode);
  const isLive = useMemo(() => getFormattedDateInPh() === gameDate, [gameDate]);

  const round = useMemo(
    () =>
      rounds[gameDate] || {
        grid: "",
      },
    [rounds, gameDate]
  );

  const [time, setTime] = useState(-1);

  useInterval(
    () => {
      if (!isLive) {
        return setTime(-1);
      }

      if (round.startedAt && round.endedAt) {
        setTime(round.endedAt - round.startedAt);
      }

      if (round.startedAt) {
        return setTime(Date.now() - round.startedAt);
      }

      return setTime(-1);
    },
    round.endedAt && round.startedAt && isLive ? null : 1000
  );

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

  return (
    <Card className="min-w-[90px] grow p-0 shadow-none">
      <CardHeader className="p-3">
        <CardTitle>{time === -1 ? "-" : timeStr}</CardTitle>
        <CardDescription>Time</CardDescription>
      </CardHeader>
    </Card>
  );
}

function ResultsDialogComponent({
  open,
  onOpenChange,
  roundStats,
  playerStats = {
    totalWins: 0,
    totalLosses: 0,
    currentWinStreak: 0,
    longestWinStreak: 0,
    winTurns: [],
    lastGameDate: "",
    lastGameId: 0,
    createdAt: Date.now(),
    updatedAt: 0,
    gameMode: "main",
  },
  gameDate,
}: Omit<RootCredenzaProps, "children"> & {
  roundStats: RoundStats;
  playerStats?: PlayerStats;
  gameDate: string;
}) {
  const gameModeConfig = SALTONG_CONFIGS[playerStats.gameMode];
  const { status } = roundStats;
  const {
    totalWins,
    totalLosses,
    currentWinStreak,
    longestWinStreak,
    winTurns,
  } = playerStats;

  const statBarData = useMemo(() => {
    return [
      {
        title: "Total Wins",
        value: totalWins,
      },
      {
        title: "Win Rate",
        value:
          ((totalWins / (totalWins + totalLosses)) * 100).toPrecision(3) + "%",
      },
      {
        title: "Win Streak",
        value: currentWinStreak,
      },
      {
        title: "Max Streak",
        value: longestWinStreak,
      },
    ];
  }, [currentWinStreak, longestWinStreak, totalLosses, totalWins]);

  const filteredGamesList = useMemo(
    () => [
      {
        mode: "archive",
        name: `${gameModeConfig.mode === "main" ? "" : gameModeConfig.mode} Archives`,
        icon: gameModeConfig.icon,
        href: `/play${playerStats.gameMode === "main" ? "" : `/${gameModeConfig.mode}`}/archives`,
      },
      ...OTHER_GAMES_LIST.filter(({ mode }) => mode !== playerStats.gameMode),
    ],
    [gameModeConfig.icon, gameModeConfig.mode, playerStats.gameMode]
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-full overflow-y-auto sm:max-h-[90dvh]">
        <DialogHeader className="px-0">
          <DialogTitle className="mb-2 border-0 font-bold">
            {STATUS_TEXT[status]}
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-3 px-4 md:px-0">
          <div className="flex flex-wrap gap-3">
            {statBarData.map((data) => (
              <Card
                key={data.title}
                className="min-w-[90px] grow p-0 shadow-none"
              >
                <CardHeader className="p-3">
                  <CardTitle>{data.value}</CardTitle>
                  <CardDescription>{data.title}</CardDescription>
                </CardHeader>
              </Card>
            ))}
            <TimeCard mode={playerStats.gameMode} gameDate={gameDate} />
          </div>
          <ResultsChart playerStats={winTurns} />
          <span className="text-center text-sm font-bold tracking-wider">
            PLAY OTHER GAMES
          </span>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {filteredGamesList.map(({ href, mode, name, icon }) => (
              <Link
                href={href}
                key={mode}
                className="min-w-[90px] grow"
                onClick={() => {
                  onOpenChange?.(false);
                }}
              >
                <Card className="hover:bg-primary-foreground h-full p-0 shadow-none">
                  <CardContent className="flex flex-col items-center justify-center p-3">
                    <div className="relative mb-2 h-[36px] sm:mb-1">
                      <Image src={icon} alt={mode} width={36} height={36} />
                      {mode === "archive" && (
                        <div className="absolute -top-2 -right-3 rounded-full bg-teal-700 p-1">
                          <ArchiveIcon className="size-4 text-teal-50" />
                        </div>
                      )}
                    </div>
                    <span className="w-full text-center text-sm font-bold tracking-wider uppercase">
                      {name}
                    </span>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
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
  const [playerStats] = usePlayerStats();
  const stats = useMemo(() => playerStats[mode], [mode, playerStats]);
  const roundStats = useRoundStats(mode, gameDate);

  if (open) {
    return (
      <ResultsDialogComponent
        open={open}
        onOpenChange={onOpenChange}
        roundStats={roundStats}
        playerStats={stats}
        gameDate={gameDate}
      />
    );
  }

  return null;
}
