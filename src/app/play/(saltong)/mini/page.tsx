import { notFound } from "next/navigation";
import getRound from "../../api/getRound";
import { Navbar, NavbarBrand } from "../../../../components/shared/navbar";
import GameWrapper from "../components/game-wrapper";
import { ResultsButton } from "../components/results-button";
import { getDateInPh } from "@/utils/time";

const MAX_TRIES = 5;
const WORD_LEN = 4;
const SUBTITLE = "Mini";
const COLOR_SCHEME = "blue";
const MODE = "mini";
const TABLE_NAME = "saltong-mini-rounds";

export default async function SaltongPage() {
  const round = await getRound(TABLE_NAME);
  const isLive = getDateInPh() === round?.date;

  if (!round) {
    return notFound();
  }

  return (
    <>
      <Navbar colorScheme={COLOR_SCHEME}>
        <NavbarBrand
          colorScheme={COLOR_SCHEME}
          title="Saltong"
          subtitle={SUBTITLE}
          boxed={`#${round.gameId}`}
        />
        <div className="flex gap-2">
          <ResultsButton mode={MODE} gameDate={round.date} />
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
