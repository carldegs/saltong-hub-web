import { Navbar } from "@/components/shared/navbar";
import DailyGamesCard from "./components/daily-games-card";
import HexGamesCard from "./components/hex-games-card";
import GameCard from "./components/game-card";
import HomeNavbarBrand from "./components/home-navbar-brand";
import { GAME_SETTINGS } from "./play/constants";
import VaultBanner from "@/components/banners/vault-banner";

export default async function HomePage() {
  const allGames = Object.values(GAME_SETTINGS);

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
          <VaultBanner />
        </div>
        <div className="@container/bot mx-auto w-full max-w-5xl space-y-8 px-4 py-8">
          <h3>All Games</h3>
          <div className="grid grid-cols-1 gap-4 @min-[600px]/bot:grid-cols-2">
            {allGames.map((config) => (
              <GameCard key={config.id} {...config} />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
