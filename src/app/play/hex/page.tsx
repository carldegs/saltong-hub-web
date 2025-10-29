import { notFound } from "next/navigation";

import { Navbar, NavbarBrand } from "../../../components/shared/navbar";
import { getFormattedHexDateInPh } from "@/utils/time";
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

export const metadata: Metadata = {
  title: "Saltong Hex",
};

export default async function SaltongHexPage({
  searchParams: _searchParams,
}: {
  searchParams: Promise<{ d?: string }>;
}) {
  const gameSettings = HEX_CONFIG;
  // eslint-disable-next-line react-hooks/purity
  const start = Date.now();
  const searchParams = await _searchParams;
  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();
  const queryClient = new QueryClient();

  console.log(
    // eslint-disable-next-line react-hooks/purity
    `SaltongHexPage: Auth check took ${Date.now() - start}ms`
  );

  if (
    !userData?.user &&
    searchParams?.d &&
    searchParams?.d !== getFormattedHexDateInPh()
  ) {
    // TODO: Create custom unauthorized page for Hex
    return notFound();
  }

  const round = await getCachedHexRound(searchParams?.d);
  const isLive = round?.date === getFormattedHexDateInPh();

  if (!round) {
    return notFound();
  }

  console.log(
    // eslint-disable-next-line react-hooks/purity
    `SaltongHexPage: Round fetched in ${Date.now() - start}ms`
  );

  if (userData?.user?.id) {
    console.log("Prefetching user round data...");
    await queryClient.prefetchQuery({
      queryKey: [
        "hex-user-round",
        { userId: userData.user.id, date: round.date },
      ],
      queryFn: async () => {
        const data = await getCachedHexUserRound(round.date, userData.user.id);

        console.log(
          // eslint-disable-next-line react-hooks/purity
          `SaltongHexPage: User round fetched in ${Date.now() - start}ms`
        );

        return data?.data;
      },
    });
  }

  const letters = round?.rootWord
    ? Array.from(new Set(round.rootWord.split(""))).filter(
        (letter) => letter !== round.centerLetter
      )
    : [];

  return (
    <div className="grid min-h-screen w-full grid-rows-[auto_1fr]">
      <Navbar colorScheme={gameSettings.colorScheme}>
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
            userId={userData?.user?.id}
          />
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
            userId={userData?.user?.id}
          />
        </HydrationBoundary>
      </HexStoreProvider>
    </div>
  );
}
