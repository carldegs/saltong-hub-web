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
import { add, format } from "date-fns";
import { ChevronLeft, ChevronRight, PlayIcon, XIcon } from "lucide-react";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import ProfileAvatar from "@/app/components/profile-avatar";
import React from "react";
import { cn } from "@/lib/utils";
import { useQueries } from "@tanstack/react-query";
import { useSupabaseClient } from "@/lib/supabase/client";
import { getLeaderboards } from "../queries/get-leaderboards";

import { LeaderboardSkeleton, DatePicker } from "./leaderboard-skeleton";
import Link from "next/link";

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
}: {
  groupId: string;
  currentUserId: string;
}) {
  const [date, setDate] = useState(new Date());

  const dateQueryKey = format(date, "yyyy-MM-dd");

  const [api, setApi] = useState<CarouselApi>();
  const [selectedMode, setSelectedMode] = useState(TABS[0].mode);

  const supabase = useSupabaseClient();
  const queries = useQueries({
    queries: TABS.map((tab) => ({
      queryKey: [
        "group-leaderboards",
        { groupId, date: dateQueryKey, mode: tab.mode },
      ],
      queryFn: async () => {
        const { data, error } = await getLeaderboards(supabase, {
          groupId,
          date: format(date, "yyyy-MM-dd"),
          mode: tab.mode,
        });

        if (error) {
          throw new Error(error.message);
        }

        return data;
      },
      enabled:
        !!groupId && !!dateQueryKey && !!tab.mode && selectedMode === tab.mode,
    })),
  });

  const data = useMemo(
    () =>
      TABS.map((tab, index) => {
        let leaderboard = queries[index].data;
        const userLeaderboardData = leaderboard?.find(
          (row) => row.userId === currentUserId
        );
        const hasUserCompleted = !!userLeaderboardData?.endedAt;

        if (!hasUserCompleted) {
          leaderboard = leaderboard?.filter(
            (row) => row.userId !== currentUserId
          );
        }

        return {
          ...tab,
          leaderboard,
          userLeaderboardData,
          hasUserCompleted,
        };
      }),
    [currentUserId, queries]
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
  }, [api]);

  return (
    <div className="@container relative grid h-full w-full grid-rows-[auto_1fr] gap-2">
      <GlassDistortionFilterDefs />
      <div className="flex items-center justify-center gap-4">
        <Button
          variant="outline"
          size="icon"
          className="size-10"
          onClick={() => {
            setDate(add(date, { days: -1 }));
          }}
        >
          <ChevronLeft size={16} />
        </Button>
        <DatePicker date={date} setDate={setDate} />
        <Button
          variant="outline"
          size="icon"
          className="size-10"
          onClick={() => {
            setDate(add(date, { days: 1 }));
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
              className={"mb-24 h-full w-full max-w-xl lg:basis-1/2"}
            >
              <Card className="mx-2 h-full w-[calc(100%-16px)]">
                <CardHeader>
                  <CardTitle>
                    <NavbarBrand
                      colorScheme={tab.colorScheme}
                      title={tab.displayName}
                      icon={tab.icon}
                      hideMenu
                      forceLarge
                    />
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-[1fr_auto] gap-6">
                  {!!tab.leaderboard?.length &&
                    !tab.hasUserCompleted &&
                    tab.userLeaderboardData && (
                      <React.Fragment>
                        <div className="flex gap-2">
                          <ProfileAvatar
                            path={tab.userLeaderboardData.avatarUrl}
                            fallback=""
                            className="size-11"
                          />
                          <div className="flex flex-col gap-0">
                            <div className="font-bold">
                              {tab.userLeaderboardData.displayName}
                            </div>
                            <div className="-mb-3 text-sm opacity-40">
                              @{tab.userLeaderboardData.username}
                            </div>
                          </div>
                        </div>

                        <div className="text-bold flex items-center justify-end">
                          <Button asChild>
                            <Link
                              href={`/play/${tab.path}?d=${dateQueryKey}`}
                              prefetch={false}
                            >
                              <PlayIcon />
                              PLAY
                            </Link>
                          </Button>
                        </div>
                      </React.Fragment>
                    )}
                  {tab.leaderboard?.map((data) => (
                    <React.Fragment key={data.userId}>
                      <div
                        className={cn("flex gap-2", {
                          "opacity-50": !data.endedAt,
                        })}
                      >
                        <ProfileAvatar
                          path={data.avatarUrl}
                          fallback=""
                          className="size-11"
                        />
                        <div className="flex flex-col gap-0">
                          <div className="font-bold">{data.displayName}</div>
                          <div className="-mb-3 text-sm opacity-40">
                            @{data.username}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-end">
                        <div
                          className={cn(
                            "bg-muted text-muted-foreground flex aspect-square size-8 items-center justify-center rounded-lg text-center text-lg leading-none font-bold",
                            {
                              "bg-saltong-green-100 text-green-800":
                                data.solvedTurn,
                              "bg-saltong-red-100 text-red-800":
                                data.endedAt && !data.solvedTurn,
                            }
                          )}
                        >
                          {data.solvedTurn && data.solvedTurn}
                          {!data.solvedTurn && data.endedAt && (
                            <XIcon className="size-6" />
                          )}
                          {!data.endedAt && "–"}
                        </div>
                      </div>
                    </React.Fragment>
                  )) || (
                    <LeaderboardSkeleton
                      numItems={temporaryList?.length ?? 3}
                    />
                  )}
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
      {/* TODO: Convert to component and use on navbar */}
      <div className="fixed bottom-2 flex w-full items-center justify-center">
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
                  className="size-[45px] bg-transparent p-0 transition-transform hover:scale-110 hover:bg-transparent"
                >
                  <Image height={45} width={45} src={tab.icon} alt={tab.path} />
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
