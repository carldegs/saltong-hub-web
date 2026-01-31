"use client";

import { RootCredenzaProps } from "@/components/ui/credenza";
import {
  LetterStatus,
  SaltongMode,
  SaltongRound,
  SaltongUserRound,
  SaltongUserRoundStatus,
  SaltongUserStats,
} from "../types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEffect, useMemo, useRef, useState } from "react";
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
import { getDurationString, getFormattedDateInPh } from "@/utils/time";
import ContributeDialog from "@/components/shared/contribute-dialog";
import ShareButtons from "@/components/shared/share-buttons";
import { getLetterStatusGrid } from "../utils/getLetterStatusGrid";
import { sendEvent } from "@/lib/analytics";
import { Button } from "@/components/ui/button";
import { SALTONG_CONFIG } from "../config";
import { getResultDialogFeaturedGameList } from "@/features/game-registry/utils/getResultDialogFeaturedGameList";
import { useSaltongUserRound } from "../hooks/user-round";
import { useSaltongUserStats } from "../hooks/user-stats";
import { differenceInMilliseconds } from "date-fns";
import { SaltongHowToPlayCard } from "./how-to-play-card";
import { GroupsDialogBanner } from "@/components/dialog-banners/groups-dialog-banner";

const STATUS_TEXT: Record<SaltongUserRoundStatus, string> = {
  correct: "SOLVED!",
  incorrect: "YOU LOSE",
  partial: "Still Guessing...",
  idle: "Start Guessing!",
};

type SaltongResultsTab = "share" | "how-to-play";

type ExtendedSaltongUserRound = SaltongUserRound & {
  isCorrect: boolean;
  status: SaltongUserRoundStatus;
  timeSolvedInSec?: number;
};

// Helper to extend user round with computed stats
function toExtendedSaltongUserRound(
  userRound: SaltongUserRound | null | undefined
): ExtendedSaltongUserRound {
  if (!userRound || !userRound.startedAt) {
    return {
      ...(userRound ?? {}),
      isCorrect: false,
      status: "idle",
    } as ExtendedSaltongUserRound;
  }

  if (userRound.startedAt && !userRound.endedAt) {
    return {
      ...userRound,
      isCorrect: false,
      status: "partial",
    };
  }

  const status = userRound.isCorrect ? "correct" : "incorrect";

  let timeSolvedInSec: number | undefined;
  if (userRound.startedAt && userRound.endedAt) {
    const started = new Date(userRound.startedAt).getTime();
    const ended = new Date(userRound.endedAt).getTime();
    timeSolvedInSec = Math.floor((ended - started) / 1000);
  }

  return {
    ...userRound,
    isCorrect: !!userRound.isCorrect,
    status,
    timeSolvedInSec,
  };
}

const getShareDetails = ({
  userRound,
  roundData,
}: {
  userRound: ExtendedSaltongUserRound;
  roundData: SaltongRound;
}) => {
  const gameSettings = SALTONG_CONFIG.modes[roundData.mode as SaltongMode];
  const title = `${gameSettings.displayName} #${roundData.roundId}`;

  const wordLen = roundData.word.length;
  const gridStatus = getLetterStatusGrid({
    gridStr: userRound.grid ?? "",
    word: roundData.word,
    wordLen,
  });

  let stats = "";

  if (userRound.isCorrect) {
    stats = `🏅${Math.floor(gridStatus.length / wordLen)} ⏳${getDurationString((userRound.timeSolvedInSec ?? 0) * 1000)}`;
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

function TimeCard({
  gameDate,
  userRound,
}: {
  gameDate: string;
  userRound: ExtendedSaltongUserRound;
}) {
  const isLive = useMemo(() => getFormattedDateInPh() === gameDate, [gameDate]);

  const initialTime = useMemo(() => {
    if (userRound?.endedAt && userRound?.startedAt) {
      return differenceInMilliseconds(
        new Date(userRound.endedAt),
        new Date(userRound.startedAt)
      );
    }
    return -1;
  }, [userRound]);

  const [time, setTime] = useState(initialTime);

  useInterval(
    () => {
      if (!isLive) {
        return setTime(-1);
      }

      const { startedAt, endedAt } = userRound || {};
      if (startedAt && endedAt) {
        return setTime(
          differenceInMilliseconds(new Date(endedAt), new Date(startedAt))
        );
      }

      if (startedAt) {
        return setTime(
          differenceInMilliseconds(new Date(), new Date(startedAt))
        );
      }

      return setTime(-1);
    },
    userRound?.endedAt && userRound?.startedAt ? null : 1000
  );

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
  userRound,
  userStats = {
    userId: "unauthenticated",
    totalWins: 0,
    totalLosses: 0,
    currentWinStreak: 0,
    longestWinStreak: 0,
    winTurns: [],
    lastGameDate: null,
    lastRoundId: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    mode: "classic",
  },
  gameDate,
  roundData,
  defaultTab = "share",
}: Omit<RootCredenzaProps, "children"> & {
  userRound: ExtendedSaltongUserRound;
  userStats?: SaltongUserStats;
  gameDate: string;
  roundData: SaltongRound;
  defaultTab?: SaltongResultsTab;
}) {
  const gameSettings =
    SALTONG_CONFIG.modes[roundData.mode as keyof typeof SALTONG_CONFIG.modes];

  const { status } = userRound;

  const totalWins = userStats?.totalWins ?? 0;
  const totalLosses = userStats?.totalLosses ?? 0;
  const currentWinStreak = userStats?.currentWinStreak ?? 0;
  const longestWinStreak = userStats?.longestWinStreak ?? 0;
  const winTurns = (userStats?.winTurns ?? []) as number[];

  const statBarData = useMemo(() => {
    return [
      {
        title: "Total Wins",
        value: totalWins,
      },
      {
        title: "Win Rate",
        value:
          totalWins + totalLosses > 0
            ? ((totalWins / (totalWins + totalLosses)) * 100).toPrecision(3) +
              "%"
            : "-",
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
    userRound,
    roundData,
  });

  const filteredGamesList = useMemo(
    () => getResultDialogFeaturedGameList(roundData.mode),
    [roundData.mode]
  );

  const [showContribution, setShowContribution] = useState(false);
  const [activeTab, setActiveTab] = useState<SaltongResultsTab>(defaultTab);
  const prevOpenRef = useRef(open);

  useEffect(() => {
    if (open && !prevOpenRef.current) {
      setActiveTab(defaultTab ?? "share");
    }

    if (!open && prevOpenRef.current) {
      setActiveTab("share");
    }

    prevOpenRef.current = open;
  }, [open, defaultTab]);

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
        <Tabs
          value={activeTab}
          className="w-full"
          onValueChange={(value) => {
            const nextTab = value as SaltongResultsTab;
            setActiveTab(nextTab);
            sendEvent("saltong_results_tab_change", { tab: nextTab });
          }}
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="share">Share</TabsTrigger>
            <TabsTrigger value="how-to-play">How To Play</TabsTrigger>
          </TabsList>
          <TabsContent value="share" className="mt-4">
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
                <TimeCard gameDate={gameDate} userRound={userRound} />
              </div>
              {winTurns?.length ? (
                <ResultsChart playerStats={winTurns} />
              ) : null}

              {status === "correct" || status === "incorrect" ? (
                <ShareButtons {...shareDetails} />
              ) : (
                <Button disabled className="h-12 w-full bg-teal-700">
                  FINISH THE GAME TO SHARE RESULTS
                </Button>
              )}

              <GroupsDialogBanner />

              <span className="text-center text-sm font-bold tracking-wider">
                PLAY OTHER GAMES
              </span>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {filteredGamesList.map(({ displayName, icon, href, id }) => (
                  <Link
                    href={href}
                    key={id}
                    className="min-w-[90px] grow"
                    onClick={() => {
                      sendEvent("button_click", {
                        location: "results_dialog",
                        action: "play_game",
                        id,
                      });
                      onOpenChange?.(false);
                    }}
                    prefetch={false}
                  >
                    <Card className="hover:bg-muted h-full p-0 shadow-none">
                      <CardContent className="flex flex-col items-center justify-center p-3">
                        <div className="relative mb-2 h-[36px] sm:mb-1">
                          <Image src={icon} alt={id} width={36} height={36} />
                          {id === "vault" && (
                            <div className="absolute -top-2 -right-3 rounded-full bg-teal-700 p-1">
                              <VaultIcon className="size-4 text-teal-50" />
                            </div>
                          )}
                        </div>
                        <span className="w-full text-center text-sm font-bold tracking-wider uppercase">
                          {id === "vault" ? "PLAY OTHER ROUNDS" : displayName}
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
          </TabsContent>
          <TabsContent value="how-to-play" className="mt-4">
            <SaltongHowToPlayCard
              displayName={gameSettings.displayName}
              maxTries={gameSettings.maxTries}
              wordLen={gameSettings.wordLen}
              examples={gameSettings.howToPlayExamples}
            />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

export default function ResultsDialog({
  open,
  onOpenChange,
  gameDate,
  roundData,
  userId,
  defaultTab = "share",
}: Omit<RootCredenzaProps, "children"> & {
  gameDate: string;
  roundData: SaltongRound;
  userId?: string;
  defaultTab?: SaltongResultsTab;
}) {
  // Use new hooks instead of deprecated ones
  const { data: userRound } = useSaltongUserRound({
    userId: userId ?? "unauthenticated",
    mode: roundData.mode as SaltongMode,
    date: gameDate,
  });

  const { data: userStats } = useSaltongUserStats({
    userId: userId ?? "unauthenticated",
    mode: roundData.mode as SaltongMode,
  });

  const extendedUserRound = useMemo(
    () => toExtendedSaltongUserRound(userRound),
    [userRound]
  );

  if (open) {
    return (
      <ResultsDialogComponent
        open={open}
        onOpenChange={onOpenChange}
        userRound={extendedUserRound}
        userStats={userStats ?? undefined}
        gameDate={gameDate}
        roundData={roundData}
        defaultTab={defaultTab}
      />
    );
  }

  return null;
}
