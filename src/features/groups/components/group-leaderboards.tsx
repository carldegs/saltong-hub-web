"use client";

import { GlassDistortionFilterDefs } from "@/components/shared/glass-distortion-filter";
import { NavbarBrand } from "@/components/shared/navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import { HEX_CONFIG } from "@/features/hex/config";
import { SALTONG_CONFIG } from "@/features/saltong/config";
import { SaltongMode } from "@/features/saltong/types";
import { add, format } from "date-fns";
import {
  getHexDateInPh,
  getHexRoundIdFromDate,
  getSaltongRoundIdFromDate,
} from "@/utils/time";

// Utility: Get previous hex game date (Tuesday/Friday)
function getPrevHexGameDate(date: Date, minDate: Date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  do {
    d.setDate(d.getDate() - 1);
    if (d < minDate) return minDate;
  } while (!(d.getDay() === 2 || d.getDay() === 5));
  return d;
}

// Utility: Get next hex game date (Tuesday/Friday)
function getNextHexGameDate(date: Date, maxDate: Date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  do {
    d.setDate(d.getDate() + 1);
    if (d > maxDate) return maxDate;
  } while (!(d.getDay() === 2 || d.getDay() === 5));
  return d;
}

function getLatestHexGameDate(date: Date, minDate: Date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);

  if (d < minDate) {
    return minDate;
  }

  while (!(d.getDay() === 2 || d.getDay() === 5)) {
    d.setDate(d.getDate() - 1);

    if (d < minDate) {
      return minDate;
    }
  }

  return d;
}
import { ChevronLeft, ChevronRight, PlayIcon } from "lucide-react";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { MemberRow } from "@/components/shared/member-row";
import React from "react";
import { useQueries } from "@tanstack/react-query";
import { useSupabaseClient } from "@/lib/supabase/client";
import {
  getLeaderboards,
  HexLeaderboardEntry,
  SaltongLeaderboardEntry,
} from "../queries/get-leaderboards";

import { LeaderboardSkeleton, DatePicker } from "./leaderboard-skeleton";
import Link from "next/link";
import { GroupLeaderboardEntry } from "./group-leaderboard-entry";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";

type SaltongModeKey = keyof typeof SALTONG_CONFIG.modes;

const TABS = [
  SALTONG_CONFIG.modes.classic,
  SALTONG_CONFIG.modes.max,
  SALTONG_CONFIG.modes.mini,
  {
    mode: "hex",
    ...HEX_CONFIG,
  },
];

export default function GroupLeaderboards({
  groupId,
  currentUserId,
  hideUnsolvedMembers,
}: {
  groupId: string;
  currentUserId: string;
  hideUnsolvedMembers: boolean;
}) {
  const [date, setDate] = useState(new Date());
  const [selectedMode, setSelectedMode] = useState(TABS[0].mode);
  const [api, setApi] = useState<CarouselApi>();
  const dateQueryKey = format(date, "yyyy-MM-dd");
  const hexDateQueryKey = format(getHexDateInPh(date), "yyyy-MM-dd");
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const hexMinDate = new Date(HEX_CONFIG.startDate);
  const saltongModes = SALTONG_CONFIG.modes;
  const validModes = Object.keys(saltongModes) as SaltongModeKey[];
  const minSelectableDate =
    selectedMode === "hex"
      ? hexMinDate
      : validModes.includes(selectedMode as SaltongModeKey)
        ? new Date(saltongModes[selectedMode as SaltongModeKey].startDate)
        : undefined;
  const maxSelectableDate =
    selectedMode === "hex" ? getLatestHexGameDate(today, hexMinDate) : today;
  const selectedDate = new Date(date);
  selectedDate.setHours(0, 0, 0, 0);
  const isPrevDateDisabled =
    !!minSelectableDate && selectedDate <= minSelectableDate;
  const isNextDateDisabled = selectedDate >= maxSelectableDate;

  const supabase = useSupabaseClient();
  const queries = useQueries({
    queries: TABS.map((tab) => ({
      queryKey: [
        "group-leaderboards",
        {
          groupId,
          date: tab.mode === "hex" ? hexDateQueryKey : dateQueryKey,
          mode: tab.mode,
        },
      ],
      queryFn: async () => {
        const { data, error } = await getLeaderboards(supabase, {
          groupId,
          date: tab.mode === "hex" ? hexDateQueryKey : dateQueryKey,
          mode: tab.mode,
        });

        if (error) {
          throw new Error(error.message);
        }

        return data;
      },
      enabled:
        !!groupId &&
        !!dateQueryKey &&
        !!hexDateQueryKey &&
        !!tab.mode &&
        selectedMode === tab.mode,
      staleTime: 1000 * 5, // 5 seconds
      refetchOnMount: true,
    })),
  });

  const data = useMemo(
    () =>
      TABS.map((tab, index) => {
        let leaderboard = queries[index].data;
        const userLeaderboardData = leaderboard?.find(
          (row) => row.userId === currentUserId
        );

        let hasUserCompleted = false;

        if (tab.mode === "hex") {
          hasUserCompleted =
            !!(userLeaderboardData as HexLeaderboardEntry)?.liveScore ||
            !!(userLeaderboardData as HexLeaderboardEntry)?.vaultScore;
        } else {
          hasUserCompleted = !!(userLeaderboardData as SaltongLeaderboardEntry)
            ?.endedAt;
        }

        if (!hasUserCompleted) {
          leaderboard = leaderboard?.filter(
            (row) => row.userId !== currentUserId
          ) as typeof leaderboard;
        }

        if (hideUnsolvedMembers) {
          leaderboard = leaderboard?.filter((row) => {
            if (tab.mode === "hex") {
              const hexRow = row as HexLeaderboardEntry;
              return !!hexRow.liveScore || !!hexRow.vaultScore;
            }

            return !!(row as SaltongLeaderboardEntry).endedAt;
          }) as typeof leaderboard;
        }

        return {
          ...tab,
          leaderboard,
          userLeaderboardData,
          hasUserCompleted,
          roundId:
            tab.mode === "hex"
              ? getHexRoundIdFromDate(dateQueryKey)
              : getSaltongRoundIdFromDate(
                  dateQueryKey,
                  tab.mode as SaltongMode
                ),
        };
      }),
    [currentUserId, hideUnsolvedMembers, queries, dateQueryKey]
  );

  const temporaryList = useMemo(
    () => queries.find((q) => q?.data?.length)?.data,
    [queries]
  );

  useEffect(() => {
    if (!api) {
      return;
    }

    api.on("select", (e) => {
      const currentTab = TABS[e.selectedSnap()];
      setSelectedMode(currentTab.mode);
    });
  }, [api, date]);

  return (
    <div className="@container relative grid h-full w-full grid-rows-[auto_1fr] gap-2">
      <GlassDistortionFilterDefs />
      <div className="flex items-center justify-center gap-4">
        <Button
          variant="outline"
          size="icon"
          className="size-10"
          disabled={isPrevDateDisabled}
          onClick={() => {
            if (isPrevDateDisabled) {
              return;
            }

            if (selectedMode === "hex") {
              setDate(getPrevHexGameDate(date, hexMinDate));
            } else {
              setDate(
                !!minSelectableDate
                  ? new Date(
                      Math.max(
                        add(date, { days: -1 }).getTime(),
                        minSelectableDate.getTime()
                      )
                    )
                  : add(date, { days: -1 })
              );
            }
          }}
        >
          <ChevronLeft size={16} />
        </Button>
        <DatePicker
          date={date}
          setDate={setDate}
          minDate={minSelectableDate}
          maxDate={maxSelectableDate}
          isDateDisabled={(d) => {
            // Disable future dates
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            d = new Date(d);
            d.setHours(0, 0, 0, 0);
            if (d > today) return true;

            if (selectedMode === "hex") {
              // Only enable Tuesdays (2) and Fridays (5)
              const day = d.getDay();
              if (day !== 2 && day !== 5) return true;
              // Before start date
              if (d < hexMinDate) return true;
            } else {
              if (validModes.includes(selectedMode as SaltongModeKey)) {
                if (
                  d <
                  new Date(
                    saltongModes[selectedMode as SaltongModeKey].startDate
                  )
                )
                  return true;
              }
            }
            return false;
          }}
        />
        <Button
          variant="outline"
          size="icon"
          className="size-10"
          disabled={isNextDateDisabled}
          onClick={() => {
            if (isNextDateDisabled) {
              return;
            }

            if (selectedMode === "hex") {
              setDate(getNextHexGameDate(date, maxSelectableDate));
            } else {
              setDate(
                new Date(
                  Math.min(
                    add(date, { days: 1 }).getTime(),
                    maxSelectableDate.getTime()
                  )
                )
              );
            }
          }}
        >
          <ChevronRight size={16} />
        </Button>
      </div>
      <Carousel
        setApi={setApi}
        className="w-full overflow-hidden"
        opts={{
          containScroll: "trimSnaps",
          breakpoints: {
            "(width >= 64rem)": {
              containScroll: false,
            },
          },
          ssr: [50, 50, 50, 50],
        }}
      >
        <CarouselContent>
          {data.map((tab, index) => (
            <CarouselItem
              key={index}
              className="mt-1 mb-24 h-full w-full max-w-xl lg:basis-1/2"
            >
              <Card className="mx-2 h-full w-[calc(100%-16px)]">
                <CardHeader>
                  <CardTitle
                    className={cn({
                      "flex items-center justify-between gap-4":
                        tab.mode === "hex" && tab.hasUserCompleted,
                    })}
                  >
                    <NavbarBrand
                      colorScheme={tab.colorScheme}
                      title={tab.displayName}
                      icon={tab.icon}
                      hideMenu
                      forceLarge
                      boxed={tab.roundId ? `#${tab.roundId}` : undefined}
                    />
                    <div>
                      {tab.mode === "hex" && tab.hasUserCompleted && (
                        <Button asChild>
                          <Link
                            href={`/play/${tab.path}?d=${tab.mode === "hex" ? hexDateQueryKey : dateQueryKey}`}
                            prefetch={false}
                          >
                            <PlayIcon />
                            PLAY
                          </Link>
                        </Button>
                      )}
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-[1fr_auto] gap-6">
                  {!!tab.leaderboard?.length &&
                    !tab.hasUserCompleted &&
                    tab.userLeaderboardData && (
                      <React.Fragment>
                        <MemberRow
                          avatarUrl={tab.userLeaderboardData.avatarUrl}
                          displayName={tab.userLeaderboardData.displayName}
                          username={tab.userLeaderboardData.username}
                        />

                        <div className="text-bold flex items-center justify-end">
                          <Button asChild>
                            <Link
                              href={`/play/${tab.path}?d=${tab.mode === "hex" ? hexDateQueryKey : dateQueryKey}`}
                              prefetch={false}
                            >
                              <PlayIcon />
                              PLAY
                            </Link>
                          </Button>
                        </div>
                      </React.Fragment>
                    )}
                  {!tab.hasUserCompleted && (
                    <Separator className="col-span-2 my-0" />
                  )}
                  {tab.leaderboard?.map((data) => (
                    <GroupLeaderboardEntry
                      key={data.userId}
                      data={data}
                      mode={tab.mode}
                    />
                  )) || (
                    <LeaderboardSkeleton numItems={temporaryList?.length} />
                  )}
                  {tab.mode === "hex" && (
                    <span className="text-sm font-bold opacity-50 hover:opacity-100">
                      * Answered from the Vault
                    </span>
                  )}
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
      {/* TODO: Convert to component and use on navbar */}
      <div className="fixed bottom-2 left-[50vw] z-10 -translate-x-1/2">
        <div className="glass-card rounded-2xl px-6 py-3 transition-[padding] hover:px-8 hover:py-4">
          <div className="glass-card-effect rounded-2xl"></div>
          <div className="glass-card-tint rounded-2xl"></div>
          <div className="glass-card-shine rounded-2xl"></div>
          <div className="glass-card-content rounded-2xl">
            <div className="flex items-center justify-center gap-4 rounded-2xl">
              {TABS.map((tab, index) => (
                <Button
                  key={index}
                  variant="default"
                  onClick={() => {
                    api?.goTo(index);
                  }}
                  className="flex size-[45px] items-center justify-center bg-transparent p-0 transition-transform hover:scale-110 hover:bg-transparent"
                >
                  <Image
                    height={45}
                    width={45}
                    src={tab.icon}
                    alt={tab.path}
                    className="block size-10 object-contain"
                  />
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
