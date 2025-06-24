import getRound from "../../../api/getRound";
import { getFormattedDateInPh, isFormattedDateInFuture } from "@/utils/time";
import { Navbar, NavbarBrand } from "@/components/shared/navbar";
import GameWrapper from "../game-wrapper";
import { ResultsButton } from "../results-button";
import { notFound } from "next/navigation";
import { ComponentProps, Suspense } from "react";
import { createClient } from "@/lib/supabase/server";
import UnauthorizedErrorPage from "@/app/components/unauthorized-error-page";
import GameWrapperLoading from "../game-wrapper-loading";
import { SaltongGameSettings } from "@/app/play/types";

async function SaltongGamePage({
  searchParams: _searchParams,
  ...gameSettings
}: {
  searchParams: Promise<{ d?: string }>;
} & SaltongGameSettings) {
  const { config, colorScheme, name, id: gameId, icon, path } = gameSettings;
  const { tableName, maxTries, wordLen } = config;
  const searchParams = await _searchParams;
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();

  if (
    !data?.user &&
    searchParams?.d &&
    searchParams?.d !== getFormattedDateInPh()
  ) {
    return <UnauthorizedErrorPage {...gameSettings} />;
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
          boxed={`#${round.gameId}`}
          icon={icon}
          name={name}
        />
        <div className="flex gap-1.5">
          <ResultsButton
            path={path}
            gameId={gameId}
            gameDate={round.date}
            roundData={round}
          />
        </div>
      </Navbar>
      <GameWrapper
        maxTries={maxTries}
        wordLen={wordLen}
        roundData={round}
        gameId={gameId}
        isLive={isLive}
      />
    </>
  );
}

function SaltongGamePageLoading(gameSettings: SaltongGameSettings) {
  const { colorScheme, config, name, icon } = gameSettings;
  const { maxTries, wordLen } = config;

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
            subtitle={name.split(" ")[1] || ""}
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
  ...gameSettings
}: {
  searchParams: Promise<{ d?: string }>;
} & SaltongGameSettings) {
  return (
    <Suspense
      key={gameSettings.id}
      fallback={<SaltongGamePageLoading {...gameSettings} />}
    >
      <SaltongGamePage searchParams={searchParams} {...gameSettings} />
    </Suspense>
  );
}
