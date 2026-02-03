import { notFound } from "next/navigation";

import { Navbar, NavbarBrand } from "../../../components/shared/navbar";
import { getFormattedHexDateInPh, isFormattedDateInFuture } from "@/utils/time";
import GameWrapper from "@/features/hex/components/game-wrapper";
import { HexStoreProvider } from "@/features/hex/providers/hex-store-provider";
import { Metadata } from "next";
import { ResultsButton } from "@/features/hex/components/results-button";
import { HEX_CONFIG } from "@/features/hex/config";
import { createClient } from "@/lib/supabase/server";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { getCachedHexRound } from "@/features/hex/queries/getHexRound";
import { getCachedHexUserRound } from "@/features/hex/queries/getHexUserRound";
import { getCharSet } from "@/features/hex/utils";
import NavbarUser from "@/components/shared/navbar-user";

export async function generateMetadata({
  searchParams: _searchParams,
}: {
  searchParams: Promise<{ d?: string }>;
}): Promise<Metadata> {
  const searchParams = await _searchParams;
  const round = await getCachedHexRound(searchParams?.d);

  if (!round) {
    return {
      title: "Saltong Hex",
      description: "Play Saltong Hex.",
      openGraph: {
        title: "Saltong Hex",
        description: "Play Saltong Hex.",
        type: "website",
        url: "https://saltong.com/play/hex",
      },
    };
  }

  return {
    title: `Saltong Hex #${round.roundId}`,
    description: `Play Saltong Hex #${round.roundId}. Find all possible words in the hexagonal grid and compete against players worldwide.`,
    openGraph: {
      title: `Saltong Hex #${round.roundId}`,
      description: `Play today's Saltong Hex puzzle #${round.roundId}. Find words in the hex grid.`,
      type: "website",
      url: "https://saltong.com/play/hex",
    },
  };
}

export default async function SaltongHexPage({
  searchParams: _searchParams,
}: {
  searchParams: Promise<{ d?: string }>;
}) {
  const gameSettings = HEX_CONFIG;
  const searchParams = await _searchParams;
  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getClaims();
  const queryClient = new QueryClient();

  if (
    !userData?.claims &&
    searchParams?.d &&
    searchParams?.d !== getFormattedHexDateInPh()
  ) {
    // TODO: Create custom unauthorized page for Hex
    return notFound();
  }

  // TODO: Test if it works on different timezones
  if (searchParams?.d && isFormattedDateInFuture(searchParams.d)) {
    return notFound();
  }

  const round = await getCachedHexRound(searchParams?.d);
  const isLive = round?.date === getFormattedHexDateInPh();

  if (!round) {
    return notFound();
  }

  if (userData?.claims.sub) {
    await queryClient.prefetchQuery({
      queryKey: [
        "hex-user-round",
        { userId: userData.claims.sub, date: round.date },
      ],
      queryFn: async () => {
        const data = await getCachedHexUserRound(
          round.date,
          userData?.claims?.sub
        );

        return data?.data;
      },
    });
  }

  const rootLetters = getCharSet(round.rootWord ?? "");
  const letters = rootLetters.filter((letter) => letter !== round.centerLetter);

  return (
    <div className="grid min-h-screen w-full grid-rows-[auto_1fr]">
      <Navbar colorScheme={gameSettings.colorScheme} hideUserDropdown>
        <NavbarBrand
          colorScheme={gameSettings.colorScheme}
          title="Saltong"
          name="Hex"
          boxed={`#${round.roundId}`}
          icon="/hex.svg"
          href="/"
          prefetch={false}
        />
        <div className="flex gap-1.5">
          <ResultsButton
            gameDate={round.date}
            isLive={isLive}
            round={round}
            userId={userData?.claims.sub}
          />
          <NavbarUser />
        </div>
      </Navbar>
      <HexStoreProvider
        initialState={{
          letters,
        }}
      >
        <HydrationBoundary state={dehydrate(queryClient)}>
          <GameWrapper
            roundData={round}
            isLive={isLive}
            userId={userData?.claims.sub}
          />
        </HydrationBoundary>
      </HexStoreProvider>
    </div>
  );
}
