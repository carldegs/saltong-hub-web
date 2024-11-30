import { notFound } from "next/navigation";
import getRound from "../../api/getRound";
import { Navbar, NavbarBrand } from "../../components/navbar";
import NavbarDrawerButton from "../../components/navbar-drawer-button";
import GameWrapper from "../components/game-wrapper";
import { ResultsButton } from "../components/results-button";
import { getDateInPh } from "@/utils/time";

const MAX_TRIES = 6;
const WORD_LEN = 5;
const SUBTITLE = "";
const COLOR_SCHEME = "green";
const MODE = "main";
const TABLE_NAME = "saltong-main-rounds";

export default async function SaltongPage() {
  const round = await getRound(TABLE_NAME);
  const isLive = getDateInPh() === round?.date;

  if (!round) {
    return notFound();
  }

  return (
    <>
      <Navbar>
        <NavbarBrand
          colorScheme={COLOR_SCHEME}
          title="Saltong"
          subtitle={SUBTITLE}
          boxed={`#${round.gameId}`}
        />
        <div className="flex gap-2">
          <ResultsButton mode={MODE} gameDate={round.date} />
          <NavbarDrawerButton />
        </div>
      </Navbar>
      <GameWrapper
        maxTries={MAX_TRIES}
        wordLen={WORD_LEN}
        roundData={round}
        mode={MODE}
        isLive={isLive}
      />
    </>
  );
}
