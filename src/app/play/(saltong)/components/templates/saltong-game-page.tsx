import getRound from "../../../api/getRound";
import { getFormattedDateInPh, isFormattedDateInFuture } from "@/utils/time";
import { Navbar, NavbarBrand } from "@/components/shared/navbar";
import GameWrapper from "../game-wrapper";
import { ResultsButton } from "../results-button";
import { GameConfig } from "../../types";
import { notFound } from "next/navigation";
import { ComponentProps, Suspense } from "react";
import { createClient } from "@/lib/supabase/server";
import UnauthorizedErrorPage from "@/app/play/(saltong)/components/archives/unauthorized-error-page";
import GameWrapperLoading from "../game-wrapper-loading";

async function SaltongGamePage({
  searchParams: _searchParams,
  ...gameConfig
}: {
  searchParams: Promise<{ d?: string }>;
} & GameConfig) {
  const { tableName, colorScheme, subtitle, mode, maxTries, wordLen, icon } =
    gameConfig;
  const searchParams = await _searchParams;
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();

  if (
    !data?.user &&
    searchParams?.d &&
    searchParams?.d !== getFormattedDateInPh()
  ) {
    return <UnauthorizedErrorPage {...gameConfig} />;
  }

  // TODO: Test if it works on different timezones
  if (searchParams?.d && isFormattedDateInFuture(searchParams.d)) {
    return notFound();
  }

  const round = await getRound(tableName, searchParams?.d);
  const isLive = getFormattedDateInPh() === round?.date;

  if (!round) {
    return notFound();
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
          title="Saltong"
          subtitle={subtitle}
          boxed={`#${round.gameId}`}
          icon={icon}
        />
        <div className="flex gap-1.5">
          <ResultsButton mode={mode} gameDate={round.date} roundData={round} />
        </div>
      </Navbar>
      <GameWrapper
        maxTries={maxTries}
        wordLen={wordLen}
        roundData={round}
        mode={mode}
        isLive={isLive}
      />
    </>
  );
}

function SaltongGamePageLoading(gameConfig: GameConfig) {
  const { colorScheme, subtitle, maxTries, wordLen, icon } = gameConfig;

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
            subtitle={subtitle}
            icon={icon}
            isLoading
          />
        </div>
      </Navbar>
      <GameWrapperLoading maxTries={maxTries} wordLen={wordLen} />
    </>
  );
}

export default async function SaltongMainPageWithSuspense({
  searchParams,
  ...gameConfig
}: {
  searchParams: Promise<{ d?: string }>;
} & GameConfig) {
  return (
    <Suspense
      key={gameConfig.mode}
      fallback={<SaltongGamePageLoading {...gameConfig} />}
    >
      <SaltongGamePage searchParams={searchParams} {...gameConfig} />
    </Suspense>
  );
}
