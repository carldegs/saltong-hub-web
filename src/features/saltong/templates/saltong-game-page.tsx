"use server";

import { getFormattedDateInPh, isFormattedDateInFuture } from "@/utils/time";
import { Navbar, NavbarBrand } from "@/components/shared/navbar";
import GameWrapper from "../components/game-wrapper";
import { ResultsButton } from "../components/results-button";
import { notFound } from "next/navigation";
import { ComponentProps, Suspense } from "react";
import { createClient } from "@/lib/supabase/server";
import UnauthorizedErrorPage from "@/app/components/unauthorized-error-page";
import GameWrapperLoading from "../components/game-wrapper-loading";
import { SaltongMode } from "../types";
import { SALTONG_CONFIG } from "../config";
import { getCachedSaltongRound } from "../queries/getSaltongRound";
import { getCachedSaltongUserRound } from "../queries/getSaltongUserRound";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

async function SaltongGamePage({
  searchParams: _searchParams,
  mode,
}: {
  searchParams: Promise<{ d?: string }>;
  mode: SaltongMode;
}) {
  const gameSettings = SALTONG_CONFIG.modes[mode];
  const { maxTries, wordLen, colorScheme, displayName, icon, path } =
    gameSettings;
  // eslint-disable-next-line react-hooks/purity -- Server component timing
  const start = Date.now();
  const searchParams = await _searchParams;
  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();
  const queryClient = new QueryClient();

  console.log(
    // eslint-disable-next-line react-hooks/purity
    `SaltongGamePage: Auth check took ${Date.now() - start}ms for mode: ${mode}`
  );

  if (
    !userData?.user &&
    searchParams?.d &&
    searchParams?.d !== getFormattedDateInPh()
  ) {
    return <UnauthorizedErrorPage {...gameSettings} />;
  }

  // TODO: Test if it works on different timezones
  if (searchParams?.d && isFormattedDateInFuture(searchParams.d)) {
    return notFound();
  }

  const round = await getCachedSaltongRound(searchParams?.d, mode);
  const isLive = getFormattedDateInPh() === round?.date;

  if (!round) {
    return notFound();
  }

  console.log(
    // eslint-disable-next-line react-hooks/purity
    `SaltongGamePage: Round fetched in ${Date.now() - start}ms for mode: ${mode}`
  );

  if (userData?.user?.id) {
    console.log("Prefetching user round data...");
    await queryClient.prefetchQuery({
      queryKey: [
        "saltong-user-round",
        { userId: userData.user.id, date: round.date, mode },
      ],
      queryFn: async () => {
        const data = (
          await getCachedSaltongUserRound(
            round.date,
            mode,
            userData.user?.id ?? ""
          )
        )?.data;

        // eslint-disable-next-line react-hooks/purity
        console.log(`User round data prefetched in ${Date.now() - start}ms`);

        return data;
      },
    });
  }

  return (
    <>
      <Navbar
        colorScheme={
          colorScheme as ComponentProps<typeof Navbar>["colorScheme"]
        }
      >
        <NavbarBrand
          colorScheme={
            colorScheme as ComponentProps<typeof Navbar>["colorScheme"]
          }
          boxed={`#${round.roundId}`}
          icon={icon}
          name={displayName}
          href="/"
        />
        <div className="flex gap-1.5">
          <ResultsButton
            path={path}
            mode={mode}
            gameDate={round.date}
            roundData={round}
            userId={userData?.user?.id}
          />
        </div>
      </Navbar>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <GameWrapper
          maxTries={maxTries}
          wordLen={wordLen}
          roundData={round}
          isLive={isLive}
          userId={userData?.user?.id}
        />
      </HydrationBoundary>
    </>
  );
}

function SaltongGamePageLoading({ mode }: { mode: SaltongMode }) {
  const { colorScheme, maxTries, wordLen, displayName, icon } =
    SALTONG_CONFIG.modes[mode];

  return (
    <>
      <Navbar
        colorScheme={
          colorScheme as ComponentProps<typeof Navbar>["colorScheme"]
        }
      >
        <div className="flex items-center gap-2">
          <NavbarBrand
            colorScheme={
              colorScheme as ComponentProps<typeof Navbar>["colorScheme"]
            }
            title="Saltong"
            subtitle={displayName.split(" ")[1] || ""}
            icon={icon}
            isLoading
            href="/"
          />
        </div>
      </Navbar>
      <GameWrapperLoading maxTries={maxTries} wordLen={wordLen} />
    </>
  );
}

export default async function SaltongMainPageWithSuspense({
  searchParams,
  mode,
}: {
  searchParams: Promise<{ d?: string }>;
  mode: SaltongMode;
}) {
  return (
    <Suspense key={mode} fallback={<SaltongGamePageLoading mode={mode} />}>
      <SaltongGamePage searchParams={searchParams} mode={mode} />
    </Suspense>
  );
}
