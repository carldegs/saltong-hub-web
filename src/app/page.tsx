import { Navbar, NavbarBrand } from "@/components/shared/navbar";
import DailyGamesCard from "./components/daily-games-card";
import HexGamesCard from "./components/hex-games-card";
import GameCard from "./components/game-card";
import { SALTONG_CONFIGS } from "./play/(saltong)/constants";
import { HEX_CONFIG } from "./play/hex/constants";

export default async function HomePage() {
  return (
    <div className="grid min-h-screen w-full grid-rows-[auto_1fr]">
      <Navbar>
        <NavbarBrand
          title="Saltong"
          subtitle="Hub"
          icon="/hub-light.svg"
          iconLight="/hub.svg"
        />
      </Navbar>
      <main className="h-full w-full">
        <div className="h-fit w-full border-b px-4 py-8">
          <div className="mx-auto grid w-full max-w-5xl grid-cols-1 gap-4 md:grid-cols-12">
            <DailyGamesCard className="md:col-span-7" />
            <HexGamesCard className="md:col-span-5" />
          </div>
        </div>
        <div className="mx-auto grid w-full max-w-5xl grid-cols-1 gap-4 px-4 py-8 md:grid-cols-2">
          <GameCard {...SALTONG_CONFIGS["main"]} />
          <GameCard {...SALTONG_CONFIGS["max"]} />
          <GameCard {...SALTONG_CONFIGS["mini"]} />
          <GameCard {...HEX_CONFIG} />
        </div>
      </main>
    </div>
  );
}
