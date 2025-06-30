"use client";

import { RootCredenzaProps } from "@/components/ui/credenza";
import { LetterStatus, PlayerStats, RoundStats, SaltongRound } from "../types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useEffect, useMemo, useState } from "react";
import usePlayerStats from "../hooks/usePlayerStats";
import useRoundStats from "../hooks/useRoundStats";
import ResultsChart from "./results-chart";
import Image from "next/image";
import Link from "next/link";
import { VaultIcon, HandCoinsIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useInterval } from "usehooks-ts";
import useRoundAnswers from "../hooks/useRoundAnswers";
import { getDurationString, getFormattedDateInPh } from "@/utils/time";
import ContributeDialog from "@/components/shared/contribute-dialog";
import { GAME_SETTINGS } from "../../constants";
import { GameId, SaltongGameSettings } from "../../types";
import { getTitleSubtitle } from "../../utils";
import ShareButtons from "@/components/shared/share-buttons";
import { getLetterStatusGrid } from "../utils";
import { sendEvent } from "@/lib/analytics";
import { Button } from "@/components/ui/button";

const OTHER_GAMES_LIST = [
  "saltong-main",
  "saltong-max",
  "saltong-mini",
  "hex",
] satisfies GameId[];

const STATUS_TEXT: Record<RoundStats["status"], string> = {
  correct: "SOLVED!",
  incorrect: "YOU LOSE",
  partial: "Still Guessing...",
  idle: "Start Guessing!",
};

const getShareDetails = ({
  roundStats,
  playerStats,
  roundData,
}: {
  roundStats: RoundStats;
  playerStats: PlayerStats;
  gameDate: string;
  roundData: SaltongRound;
}) => {
  const title = `${GAME_SETTINGS[playerStats.gameId].name} #${roundData.gameId}`;

  const wordLen = roundData.word.length;
  const gridStatus = getLetterStatusGrid({
    gridStr: roundStats.round.grid,
    word: roundData.word,
    wordLen,
  });

  let stats = "";

  if (roundStats.isCorrect) {
    stats = `🏅${Math.floor(gridStatus.length / wordLen)} ⏳${getDurationString((roundStats.timeSolvedInSec ?? 0) * 1000)}`;
  } else {
    stats = `🏅X/${wordLen}`;
  }

  // Pad gridStatus to have n rows equal to maxTries
  const chunkedGridStatus = [];
  for (let i = 0; i < gridStatus.length; i += wordLen) {
    chunkedGridStatus.push(gridStatus.slice(i, i + wordLen));
  }

  const grid = chunkedGridStatus
    .join("\n")
    .replaceAll(LetterStatus.Correct, "🟩")
    .replaceAll(LetterStatus.Incorrect, "⬛")
    .replaceAll(LetterStatus.Empty, "⬛")
    .replaceAll(LetterStatus.Partial, "🟨");

  const message = `${title}\n\n${stats}\n\n${grid}\n\n${window.location.href}`;

  return {
    title,
    message,
  };
};

function TimeCard({ gameId, gameDate }: { gameId: GameId; gameDate: string }) {
  const [rounds] = useRoundAnswers(gameId);
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
    round.endedAt && round.startedAt ? null : 1000
  );

  useEffect(() => {
    if (round.endedAt && round.startedAt) {
      setTime(round.endedAt - round.startedAt);
    }
  }, [isLive, round.endedAt, round.startedAt]);

  if (!isLive) {
    return null;
  }

  const timeStr = getDurationString(time);

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
    gameId: "saltong-main",
  },
  gameDate,
  roundData,
}: Omit<RootCredenzaProps, "children"> & {
  roundStats: RoundStats;
  playerStats?: PlayerStats;
  gameDate: string;
  roundData: SaltongRound;
}) {
  const gameSettings = GAME_SETTINGS[
    playerStats.gameId as keyof typeof GAME_SETTINGS
  ] as SaltongGameSettings;
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

  const shareDetails = getShareDetails({
    playerStats,
    roundStats,
    gameDate,
    roundData,
  });

  const filteredGamesList = useMemo(() => {
    const subtitle = getTitleSubtitle(gameSettings.name).subtitle;
    return [
      {
        gameId: "vault",
        name: `${subtitle ?? ""}${subtitle ? " " : ""}Vault`,
        icon: gameSettings.icon,
        href: `/play${gameSettings.path}/vault`,
      },
      ...OTHER_GAMES_LIST.filter((gameId) => gameId !== gameSettings.id).map(
        (gameId) => {
          const settings = GAME_SETTINGS[gameId as keyof typeof GAME_SETTINGS];
          return {
            gameId: settings.id,
            name: settings.name,
            icon: settings.icon,
            href: `/play${settings.path}`,
          };
        }
      ),
    ];
  }, [
    gameSettings.name,
    gameSettings.icon,
    gameSettings.path,
    gameSettings.id,
  ]);

  const [showContribution, setShowContribution] = useState(false);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {showContribution && (
        <ContributeDialog
          open={showContribution}
          onOpenChange={setShowContribution}
        />
      )}

      <DialogContent className="max-h-full overflow-y-auto sm:max-h-[90dvh]">
        <DialogHeader className="px-0">
          <DialogTitle className="mb-2 border-0 font-bold">
            {STATUS_TEXT[status]}
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-3 md:px-0">
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
            <TimeCard gameId={gameSettings.id} gameDate={gameDate} />
          </div>
          <ResultsChart playerStats={winTurns} />
          {status === "correct" || status === "incorrect" ? (
            <ShareButtons {...shareDetails} />
          ) : (
            <Button disabled className="h-12 w-full bg-teal-700">
              FINISH THE GAME TO SHARE RESULTS
            </Button>
          )}

          <span className="text-center text-sm font-bold tracking-wider">
            PLAY OTHER GAMES
          </span>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {filteredGamesList.map(({ href, gameId, name, icon }) => (
              <Link
                href={href}
                key={gameId}
                className="min-w-[90px] grow"
                onClick={() => {
                  sendEvent("button_click", {
                    location: "results_dialog",
                    action: "play_game",
                    gameId,
                  });
                  onOpenChange?.(false);
                }}
              >
                <Card className="hover:bg-muted h-full p-0 shadow-none">
                  <CardContent className="flex flex-col items-center justify-center p-3">
                    <div className="relative mb-2 h-[36px] sm:mb-1">
                      <Image src={icon} alt={gameId} width={36} height={36} />
                      {gameId === "vault" && (
                        <div className="absolute -top-2 -right-3 rounded-full bg-teal-700 p-1">
                          <VaultIcon className="size-4 text-teal-50" />
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

            <Card
              onClick={() => {
                setShowContribution(true);
                sendEvent("button_click", {
                  location: "results_dialog",
                  action: "contribute",
                });
              }}
              className="col-span-2 h-full cursor-pointer bg-cyan-100 p-0 text-cyan-700 shadow-none hover:bg-cyan-300 dark:bg-cyan-900/20 dark:text-cyan-100 dark:hover:bg-cyan-900"
            >
              <CardContent className="flex h-full items-center justify-center gap-3 p-3">
                <div className="relative mb-2 h-[36px] sm:mb-1">
                  <HandCoinsIcon size={36} />
                </div>
                <div className="flex flex-col">
                  <span className="w-full text-sm font-bold tracking-wider uppercase">
                    CONTRIBUTE
                  </span>
                  <span className="w-full text-sm">
                    Help keep the site running!
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function ResultsDialog({
  open,
  onOpenChange,
  gameId,
  gameDate,
  roundData,
}: Omit<RootCredenzaProps, "children"> & {
  gameId: GameId;
  gameDate: string;
  roundData: SaltongRound;
}) {
  const [playerStats] = usePlayerStats();
  const stats = useMemo(() => playerStats[gameId], [gameId, playerStats]);
  const roundStats = useRoundStats(gameId, gameDate);

  if (open) {
    return (
      <ResultsDialogComponent
        open={open}
        onOpenChange={onOpenChange}
        roundStats={roundStats}
        playerStats={stats}
        gameDate={gameDate}
        roundData={roundData}
      />
    );
  }

  return null;
}
