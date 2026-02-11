import HomeNavbarBrand from "@/app/components/home-navbar-brand";
import ProfileAvatar from "@/app/components/profile-avatar";
import { Navbar, navbarBrandTitleVariants } from "@/components/shared/navbar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import getSaltongProfileStats from "@/features/profiles/queries/get-profile-stats";
import ResultsChart from "@/features/saltong/components/results-chart";
import { SALTONG_CONFIG } from "@/features/saltong/config";
import { createClient } from "@/lib/supabase/server";
import { cn } from "@/lib/utils";
import { PencilIcon, PlayIcon } from "lucide-react";
import Image from "next/image";
import { notFound } from "next/navigation";
import { WinRateChart } from "./components/win-rate-chart";
import { NumberTicker } from "@/components/ui/number-ticker";
import Link from "next/link";
import { getProfileById } from "@/features/profiles/queries/get-profile";
import { Metadata } from "next";

// For now, only the user can view their own profile. Need to setup a public table for profiles later.

export async function generateMetadata(): Promise<Metadata> {
  const supabase = await createClient();
  // TODO: Use route params to view other users' profiles once public profiles are setup.
  const { data: claimsData, error } = await supabase.auth.getClaims();

  if (error || !claimsData?.claims) {
    return {
      title: "Profile - Saltong Hub",
    };
  }

  const userId = claimsData.claims.sub;
  const { data: profile } = await getProfileById(supabase, userId);

  if (!profile) {
    return {
      title: "Profile | Saltong Hub",
    };
  }

  return {
    title: `${profile.display_name} (@${profile.username}) | Saltong Hub`,
    description: `View ${profile.display_name}'s Saltong Hub profile and game statistics. See their wins, streaks, and performance across all game modes.`,
    openGraph: {
      title: `${profile.display_name} - Saltong Hub Profile`,
      description: `Check out ${profile.display_name}'s Saltong Hub profile and stats.`,
      type: "profile",
      url: `https://saltong.com/u/${userId}`,
    },
  };
}

export default async function UserProfile() {
  const supabase = await createClient();

  const { data: claimsData, error } = await supabase.auth.getClaims();

  if (error || !claimsData?.claims) {
    return notFound();
  }

  // TODO: Use route params to view other users' profiles once public profiles are setup. For now, only allow viewing own profile.
  const userId = claimsData.claims.sub;

  // TODO: fetch both profile and stats in parallel

  const { data: profile } = await getProfileById(supabase, userId);

  const { data } = await getSaltongProfileStats(supabase, userId);

  if (!profile) {
    return notFound();
  }

  const gameStatsList = Object.values(SALTONG_CONFIG.modes).map((config) => {
    const stat = data?.find((s) => s.mode === config.mode);

    const { winTurns, totalWins, currentWinStreak, longestWinStreak } =
      stat ?? {};

    const totalWinTurns = !winTurns
      ? 0
      : (winTurns as number[])?.reduce(
          (prev, curr, i) => prev + curr * (i + 1),
          0
        ) || 0;

    const avgTurnsToWin = totalWins ? totalWinTurns / totalWins : undefined;

    const statsBarData = [
      {
        title: "Win Streak",
        value: currentWinStreak,
      },
      {
        title: "Max Streak",
        value: longestWinStreak,
      },
    ];

    return {
      stats: {
        ...stat,
        avgTurnsToWin,
      },
      statsBarData,
      ...config,
    };
  });

  return (
    <div className="grid min-h-screen w-full grid-rows-[auto_1fr]">
      <Navbar>
        <HomeNavbarBrand />
      </Navbar>
      <main className="dark:from-background dark:via-muted/60 dark:to-muted/80 @container/top h-full w-full bg-gradient-to-br from-[#f8fafc] via-[#e0e7ef] to-[#f1f5f9] px-4 py-6">
        <div className="mb-8 flex flex-col items-center justify-center gap-2">
          <div className="flex flex-col items-center justify-center gap-4 md:flex-row">
            <ProfileAvatar
              path={profile.avatar_url ?? ""}
              fallback={claimsData.claims?.email ?? ""}
              className="size-20"
            />
            <div className="align-center flex flex-col items-center gap-0 md:items-start">
              <div className="text-2xl font-bold">{profile.display_name}</div>
              <div className="text-base">@{profile.username}</div>
            </div>
          </div>

          <Button asChild variant="outline" size="sm" className="mt-2">
            <Link href="/settings/account">
              <PencilIcon />
              Edit
            </Link>
          </Button>
        </div>

        {gameStatsList.map(
          ({ mode, icon, displayName, colorScheme, stats }) => (
            <div className="mx-auto mb-8 w-full max-w-4xl" key={mode}>
              <div className="mb-4 flex w-full items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Image
                    src={icon}
                    alt={`${displayName} Logo`}
                    width={32}
                    height={32}
                  />
                  <div
                    className={cn(
                      "text-lg font-bold",
                      navbarBrandTitleVariants({ colorScheme })
                    )}
                  >
                    {displayName}
                  </div>
                </div>

                <Button size="sm">
                  <PlayIcon />
                  Play
                </Button>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-5 md:grid-rows-3">
                <ResultsChart
                  playerStats={(stats.winTurns as number[]) ?? []}
                  className="gap-4 pb-0 shadow-none hover:shadow-sm md:col-span-3 md:row-span-3"
                />
                <Card className="gap-0 pb-0 shadow-none hover:shadow-sm md:col-span-2 md:row-span-2">
                  <CardHeader>
                    <CardTitle>Win Rate</CardTitle>
                    {stats?.totalWins && stats?.totalLosses && (
                      <CardDescription>
                        You were able to solve{" "}
                        <b>
                          {stats.totalWins} out of{" "}
                          {stats.totalWins + stats.totalLosses}
                        </b>{" "}
                        games.
                      </CardDescription>
                    )}
                  </CardHeader>

                  <CardContent className="flex-1 pb-0">
                    <WinRateChart
                      totalWins={stats?.totalWins ?? 0}
                      totalLosses={stats?.totalLosses ?? 0}
                    />
                  </CardContent>
                </Card>
                <Card className="gap-4 shadow-none hover:shadow-sm md:col-span-2">
                  <CardHeader>
                    <CardTitle>Streaks</CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-row items-center justify-evenly">
                    <div className="mt-4 flex flex-col items-center justify-center">
                      <NumberTicker
                        startValue={0}
                        value={stats?.currentWinStreak ?? 0}
                        className="text-2xl font-bold"
                      />
                      <span className="text-muted-foreground ml-2 text-center text-sm">
                        Current Streak
                      </span>
                    </div>
                    <div className="mt-4 flex flex-col items-center justify-center">
                      <NumberTicker
                        startValue={0}
                        value={stats?.longestWinStreak ?? 0}
                        className="text-2xl font-bold"
                      />
                      <span className="text-muted-foreground ml-2 text-center text-sm">
                        Longest Streak
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )
        )}
      </main>
    </div>
  );
}
