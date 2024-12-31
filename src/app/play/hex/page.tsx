import { notFound } from "next/navigation";

import getRound from "../api/getRound";
import { Navbar, NavbarBrand } from "../../../components/shared/navbar";
import { getFormattedHexDateInPh } from "@/utils/time";
import GameWrapper from "./components/game-wrapper";
import { HexStoreProvider } from "./providers/hex-store-provider";

const SUBTITLE = "Hex";
const COLOR_SCHEME = "purple";
const TABLE_NAME = "saltong-hex-rounds";

export default async function SaltongHexPage({
  searchParams,
}: {
  searchParams: { d?: string };
}) {
  const round = await getRound(TABLE_NAME, searchParams?.d);
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
      <Navbar colorScheme={COLOR_SCHEME}>
        <NavbarBrand
          colorScheme={COLOR_SCHEME}
          title="Saltong"
          subtitle={SUBTITLE}
          boxed={`#${round.gameId}`}
          icon="/hex.svg"
        />
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
