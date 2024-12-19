import { notFound } from "next/navigation";
import getRound from "../../api/getRound";
import { Navbar, NavbarBrand } from "../../../../components/shared/navbar";
import GameWrapper from "../components/game-wrapper";
import { ResultsButton } from "../components/results-button";
import { getDateInPh } from "@/utils/time";

const MAX_TRIES = 8;
const WORD_LEN = 7;
const SUBTITLE = "Max";
const COLOR_SCHEME = "red";
const MODE = "max";
const TABLE_NAME = "saltong-max-rounds";

export default async function SaltongPage({
  searchParams,
}: {
  searchParams: { d?: string };
}) {
  const round = await getRound(TABLE_NAME, searchParams?.d);
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
