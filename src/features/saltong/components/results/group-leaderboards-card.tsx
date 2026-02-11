"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/components/ui/empty";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useLeaderboards } from "@/features/groups/hooks/use-leaderboards";
import { getUserGroups } from "@/features/groups/queries/get-group";
import { createClient } from "@/lib/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo } from "react";
import { useLocalStorage } from "usehooks-ts";
import { GroupLeaderboardEntry } from "@/features/groups/components/group-leaderboard-entry";
import { LeaderboardSkeleton } from "@/features/groups/components/leaderboard-skeleton";
import ProfileAvatar from "@/app/components/profile-avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SaltongLeaderboardEntry } from "@/features/groups/queries/get-leaderboards";
import Link from "next/link";
import { ArrowRightIcon } from "lucide-react";
import { sendEvent } from "@/lib/analytics";

const MOCK_LEADERBOARDS: {
  leaderboards: Partial<SaltongLeaderboardEntry>[];
  title: string;
  groupName: string;
  description: string;
}[] = [
  {
    title: "Oh hello there misteryoso!",
    groupName: "Yumi",
    description:
      "Ang buhay ay hindi karera, but Saltong is! Create a group and compete with your friends to see who's the best.",
    leaderboards: [
      {
        userId: "bini-aiah",
        username: "aiah",
        displayName: "Aiah",
        avatarUrl: "ba://bini-aiah",
        solvedTurn: 3,
        endedAt: "x",
      },
      {
        userId: "bini-colet",
        username: "colet",
        displayName: "Colet",
        avatarUrl: "ba://bini-colet",
        solvedTurn: 2,
        endedAt: "x",
      },
      {
        userId: "bini-maloi",
        username: "maloi",
        displayName: "Maloi",
        avatarUrl: "ba://bini-maloi",
        solvedTurn: 4,
        endedAt: "x",
      },
      {
        userId: "bini-gwen",
        username: "gwen",
        displayName: "Gwen",
        avatarUrl: "ba://bini-gwen",
        solvedTurn: 5,
        endedAt: "x",
      },
      {
        userId: "bini-stacey",
        username: "stacey",
        displayName: "Stacey",
        avatarUrl: "ba://bini-stacey",
        solvedTurn: 6,
        endedAt: "x",
      },
      {
        userId: "bini-mikha",
        username: "mikha",
        displayName: "Mikha",
        avatarUrl: "ba://bini-mikha",
        solvedTurn: 3,
        endedAt: "x",
      },
      {
        userId: "bini-sheena",
        username: "sheena",
        displayName: "Sheena",
        avatarUrl: "ba://bini-sheena",
        solvedTurn: 4,
        endedAt: "x",
      },
      {
        userId: "bini-jhoanna",
        username: "jhoanna",
        displayName: "Jhoanna",
        avatarUrl: "ba://bini-jhoanna",
        solvedTurn: 2,
        endedAt: "x",
      },
    ],
  },
  {
    title: "Minumulto ng damdamin mo?",
    groupName: "Capuccino Venti",
    description:
      "Distract yourself by competing with your friends in Saltong by creating a group!",
    leaderboards: [
      {
        userId: "cup-of-joe-gian",
        username: "gian",
        displayName: "Gian",
        avatarUrl: "ba://cup-of-joe-gian",
        solvedTurn: 3,
        endedAt: "x",
      },
      {
        userId: "cup-of-joe-rapha",
        username: "rapha",
        displayName: "Rapha",
        avatarUrl: "ba://cup-of-joe-rapha",
        solvedTurn: 2,
        endedAt: "x",
      },
      {
        userId: "cup-of-joe-xander",
        username: "xen",
        displayName: "Xen",
        avatarUrl: "ba://cup-of-joe-xander",
        solvedTurn: 4,
        endedAt: "x",
      },
      {
        userId: "cup-of-joe-gab",
        username: "gab",
        displayName: "Gab",
        avatarUrl: "ba://cup-of-joe-gab",
        solvedTurn: 5,
        endedAt: "x",
      },
      {
        userId: "cup-of-joe-cj",
        username: "cj",
        displayName: "CJ",
        avatarUrl: "ba://cup-of-joe-cj",
        solvedTurn: 6,
        endedAt: "x",
      },
    ],
  },
  {
    title: "Panalo na naman na naman?",
    groupName: "IX of Hearts",
    description:
      "Show off your skills with your friends by creating a group and competing on the leaderboards!",
    leaderboards: [
      {
        userId: "ivos-unique",
        username: "unique",
        displayName: "Unique",
        avatarUrl: "ba://ivos-unique",
        solvedTurn: 2,
        endedAt: "x",
      },
      {
        userId: "ivos-zild",
        username: "zild",
        displayName: "Zild",
        avatarUrl: "ba://ivos-zild",
        solvedTurn: 3,
        endedAt: "x",
      },
      {
        userId: "ivos-blaster",
        username: "blaster",
        displayName: "Blaster",
        avatarUrl: "ba://ivos-blaster",
        solvedTurn: 4,
        endedAt: "x",
      },
      {
        userId: "ivos-badjao",
        username: "badjao",
        displayName: "Badjao",
        avatarUrl: "ba://ivos-badjao",
        solvedTurn: 5,
        endedAt: "x",
      },
    ],
  },
];

export default function GroupLeaderboardsCard({
  userId,
  mode,
  date,
}: {
  userId: string;
  mode: string;
  date: string;
}) {
  const [selectedGroupId, setselectedGroupId] = useLocalStorage<string | null>(
    "leaderboards-selected-group-id",
    null
  );
  const {
    data: groupList,
    isLoading: isLoadingGroupList,
    status: groupListQueryStatus,
  } = useQuery({
    queryKey: ["user-groups", userId],
    queryFn: async () => {
      const client = await createClient();
      return getUserGroups(client, userId);
    },
    enabled: !!userId && userId !== "unauthenticated",
  });

  const { data: leaderboards, isLoading: isLoadingLeaderboards } =
    useLeaderboards({
      groupId: selectedGroupId ?? undefined,
      mode,
      date,
    });

  useEffect(() => {
    if (groupListQueryStatus === "success") {
      if (
        !selectedGroupId ||
        !groupList?.some((group) => group.id === selectedGroupId)
      ) {
        if (!groupList?.length) {
          return;
        }

        // defaultGroup should be the group with the most members
        const defaultGroup = groupList?.reduce((prev, current) =>
          (prev?.memberCount ?? 0) > (current?.memberCount ?? 0)
            ? prev
            : current
        );

        if (defaultGroup?.id) {
          setselectedGroupId(defaultGroup.id);
        }
      }
    }
  }, [groupList, groupListQueryStatus, selectedGroupId, setselectedGroupId]);

  const selectedGroup = useMemo(() => {
    return groupList?.find((group) => group.id === selectedGroupId);
  }, [groupList, selectedGroupId]);

  const mockData = useMemo(() => {
    // randomize the mock data by using Math.random
    const randomizedData = [...MOCK_LEADERBOARDS].sort(
      // eslint-disable-next-line react-hooks/purity
      () => 0.5 - Math.random()
    );
    return randomizedData[0];
  }, []);

  if (
    userId === "unauthenticated" ||
    ((!groupList || !groupList?.length) && !isLoadingGroupList)
  ) {
    return (
      <div className="relative">
        <div className="absolute z-2 flex h-full w-full items-center justify-center overflow-hidden rounded-lg bg-linear-to-br from-pink-500/70 to-pink-600/60 dark:from-pink-400/30 dark:to-pink-500/20">
          <Empty>
            <EmptyHeader>
              <EmptyTitle className="text-white">{mockData.title}</EmptyTitle>
              <EmptyDescription className="font-semibold text-white">
                {mockData.description}
              </EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              {userId === "unauthenticated" ? (
                <div className="flex w-full gap-2">
                  <Button
                    asChild
                    className="flex-1 bg-pink-500 text-white hover:bg-pink-600"
                  >
                    <Link
                      href="/auth?signup=1"
                      prefetch={false}
                      onClick={() => {
                        sendEvent("button_click", {
                          location: "results_dialog_group_banner",
                          action: "create_account",
                          mode,
                          date,
                        });
                      }}
                    >
                      Create Account
                    </Link>
                  </Button>

                  <Button asChild variant="outline" className="flex-1">
                    <Link
                      href="/auth"
                      prefetch={false}
                      onClick={() => {
                        sendEvent("button_click", {
                          location: "results_dialog_group_banner",
                          action: "login",
                          mode,
                          date,
                        });
                      }}
                    >
                      Login
                    </Link>
                  </Button>
                </div>
              ) : (
                <Button
                  asChild
                  className="flex-1 bg-pink-500 text-white hover:bg-pink-600"
                >
                  <Link
                    href="/groups/create"
                    prefetch={false}
                    onClick={() => {
                      sendEvent("button_click", {
                        location: "results_dialog_group_banner",
                        action: "create_group",
                        mode,
                        date,
                      });
                    }}
                  >
                    Create Group
                  </Link>
                </Button>
              )}
            </EmptyContent>
          </Empty>
        </div>
        <Card className="gap-4">
          <CardContent className="space-y-3 blur-[2px]">
            <div className="text-lg font-semibold tracking-tight">
              {mockData.groupName} Leaderboards
            </div>

            <ScrollArea className="h-full max-h-[209px] overflow-auto rounded-md">
              <div className="bg-muted/50 grid grid-cols-2 gap-4 rounded-md p-4">
                {mockData.leaderboards
                  .sort((a, b) => (b.solvedTurn ?? 0) - (a.solvedTurn ?? 0))
                  .map((data) => (
                    <GroupLeaderboardEntry
                      key={data.userId}
                      data={data as SaltongLeaderboardEntry}
                      mode={mode}
                    />
                  ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    );
  }

  const isLoading = isLoadingGroupList && !isLoadingLeaderboards;
  const canShowLeaderboards =
    !isLoading && !!leaderboards && leaderboards.length > 1;

  return (
    <Card className="gap-4">
      <CardHeader>
        <div className="flex w-full items-center justify-start gap-2">
          {isLoadingGroupList ? (
            <Skeleton className="h-4 w-2/5" />
          ) : (
            (groupList ?? []).length > 1 && (
              <Select
                value={selectedGroupId ?? undefined}
                onValueChange={(value) => {
                  sendEvent("saltong_results_group_change", {
                    mode,
                    date,
                    groupId: value,
                  });
                  setselectedGroupId(value);
                }}
              >
                <SelectTrigger className="h-auto rounded-none border-0 border-b-1 p-0 text-lg font-semibold shadow-none">
                  <SelectValue placeholder="Select group" />
                </SelectTrigger>
                <SelectContent>
                  {groupList?.map((group) => (
                    <SelectItem key={group.id} value={group.id}>
                      <ProfileAvatar
                        path={group.avatarUrl ?? ""}
                        fallback={group.name}
                        profileType="group"
                        className="mr-2 size-4"
                      />
                      {group.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )
          )}
          <span className="text-lg font-semibold tracking-tight">
            {groupList?.length === 1 && selectedGroup
              ? `${selectedGroup.name} `
              : ""}
            Leaderboards
          </span>
        </div>
        {!!selectedGroup?.id && (
          <CardAction>
            <Button size="sm" variant="outline" asChild>
              <Link
                href={`/groups/${selectedGroup.id}`}
                prefetch={false}
                onClick={() => {
                  sendEvent("button_click", {
                    location: "results_dialog",
                    action: "view_group",
                    groupId: selectedGroup.id,
                    mode,
                    date,
                  });
                }}
              >
                View <ArrowRightIcon />
              </Link>
            </Button>
          </CardAction>
        )}
      </CardHeader>
      <CardContent className="space-y-3">
        {isLoading ? (
          <div className="bg-muted/50 grid grid-cols-2 gap-3 rounded-md p-4">
            <LeaderboardSkeleton numItems={3} />
          </div>
        ) : canShowLeaderboards ? (
          <ScrollArea className="h-full max-h-[209px] overflow-auto rounded-md">
            <div className="bg-muted/50 grid grid-cols-2 gap-4 rounded-md p-4">
              {leaderboards.map((data) => (
                <GroupLeaderboardEntry
                  key={data.userId}
                  data={data}
                  mode={mode}
                />
              ))}
            </div>
          </ScrollArea>
        ) : (
          <div className="bg-muted/50 gap-3 rounded-md">
            <Empty>
              <EmptyHeader>
                <EmptyTitle>No Members Found</EmptyTitle>
                <EmptyDescription>
                  It looks like there are no members in your group yet. Invite
                  some now.
                </EmptyDescription>
              </EmptyHeader>
              <EmptyContent>
                {/* TODO: Redirect to /groups/<groupId> */}
                <Button
                  onClick={() => {
                    sendEvent("button_click", {
                      location: "results_dialog_group_leaderboard",
                      action: "invite_members",
                      groupId: selectedGroupId,
                      mode,
                      date,
                    });
                  }}
                >
                  Invite Members
                </Button>
              </EmptyContent>
            </Empty>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
