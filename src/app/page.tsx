import type { Metadata } from "next";
import { Navbar } from "@/components/shared/navbar";
import DailyGamesCard from "./components/daily-games-card";
import HexGamesCard from "./components/hex-games-card";
import GameCard from "./components/game-card";
import HomeNavbarBrand from "./components/home-navbar-brand";
import { SALTONG_CONFIG } from "@/features/saltong/config";
import { HEX_CONFIG } from "@/features/hex/config";
import CreateAccountBanner from "@/components/banners/create-account-banner";
import GroupsBanner from "@/components/banners/groups-banner";

const GAME_LIST = [...Object.values(SALTONG_CONFIG.modes), HEX_CONFIG];

export const metadata: Metadata = {
  title: "Saltong Hub",
  description:
    "Challenge yourself with Saltong, Saltong Mini, Saltong Max, and Saltong Hex. Play daily games, solve puzzles, and compete with friends.",
  openGraph: {
    title: "Saltong Hub",
    description:
      "Challenge yourself with Saltong, Saltong Mini, Saltong Max, and Saltong Hex. Play daily games, solve puzzles, and compete with friends.",
    type: "website",
    url: "https://saltong.com",
  },
};

export default async function HomePage() {
  return (
    <div className="grid min-h-screen w-full grid-rows-[auto_1fr]">
      <Navbar>
        <HomeNavbarBrand />
      </Navbar>
      <main className="@container/top h-full w-full">
        <div className="bg-muted/10 relative h-fit w-full overflow-hidden border-b">
          <div className="mx-auto grid w-full max-w-5xl grid-cols-1 gap-4 px-4 py-8 @min-[600px]/top:grid-cols-12">
            <DailyGamesCard className="@min-[600px]/top:col-span-7" />
            <HexGamesCard className="@min-[600px]/top:col-span-5" />
          </div>
        </div>

        <div className="mx-auto mt-6 max-w-6xl px-4">
          <GroupsBanner />
          {/* <VaultBanner /> */}
        </div>
        <div className="@container/bot mx-auto w-full max-w-5xl space-y-8 px-4 py-8">
          <h3>All Games</h3>
          <div className="grid grid-cols-1 gap-4 @min-[600px]/bot:grid-cols-2">
            {GAME_LIST.map((config) => (
              <GameCard key={config?.displayName} {...config} />
            ))}
          </div>
        </div>
        <div className="@container/bot mx-auto w-full max-w-5xl space-y-8 px-4 py-8">
          <CreateAccountBanner />
        </div>
      </main>
    </div>
  );
}
