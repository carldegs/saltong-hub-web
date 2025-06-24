import { notFound } from "next/navigation";

import getRound from "../api/getRound";
import { Navbar, NavbarBrand } from "../../../components/shared/navbar";
import { getFormattedHexDateInPh } from "@/utils/time";
import GameWrapper from "./components/game-wrapper";
import { HexStoreProvider } from "./providers/hex-store-provider";
import { Metadata } from "next";
import { ResultsButton } from "./components/results-button";
import { GAME_SETTINGS } from "../constants";

const SETTINGS = GAME_SETTINGS["hex"];

export const metadata: Metadata = {
  title: "Saltong Hex",
};

export default async function SaltongHexPage(props: {
  searchParams: Promise<{ d?: string }>;
}) {
  const searchParams = await props.searchParams;
  const round = await getRound(SETTINGS.config.tableName, searchParams?.d);
  const isLive = round?.date === getFormattedHexDateInPh();

  if (!round) {
    return notFound();
  }

  const letters = round?.rootWord
    ? Array.from(new Set(round.rootWord.split(""))).filter(
        (letter) => letter !== round.centerLetter
      )
    : [];

  return (
    <div className="grid min-h-screen w-full grid-rows-[auto_1fr]">
      <Navbar colorScheme={SETTINGS.colorScheme}>
        <NavbarBrand
          colorScheme={SETTINGS.colorScheme}
          title="Saltong"
          name={SETTINGS.name}
          boxed={`#${round.gameId}`}
          icon="/hex.svg"
        />
        <div className="flex gap-1.5">
          <ResultsButton gameDate={round.date} isLive={isLive} round={round} />
        </div>
      </Navbar>
      <HexStoreProvider
        initialState={{
          letters,
        }}
      >
        <GameWrapper roundData={round} isLive={isLive} />
      </HexStoreProvider>
    </div>
  );
}
