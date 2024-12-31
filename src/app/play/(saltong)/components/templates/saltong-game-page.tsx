import { notFound } from "next/navigation";
import getRound from "../../../api/getRound";
import { getFormattedDateInPh } from "@/utils/time";
import { Navbar, NavbarBrand } from "@/components/shared/navbar";
import GameWrapper from "../game-wrapper";
import { ResultsButton } from "../results-button";
import { GameConfig } from "../../types";
import { ComponentProps } from "react";

export default async function SaltongGamePage({
  searchParams,
  tableName,
  colorScheme,
  subtitle,
  mode,
  maxTries,
  wordLen,
  icon,
}: {
  searchParams: { d?: string };
} & GameConfig) {
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
        <div className="flex gap-2">
          <ResultsButton mode={mode} gameDate={round.date} />
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
