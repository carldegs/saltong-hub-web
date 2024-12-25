import { Navbar, NavbarBrand } from "@/components/shared/navbar";
import DailyGamesCard from "./components/daily-games-card";
import HexGamesCard from "./components/hex-games-card";

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
      <main className="h-full w-full flex-1 justify-center lg:flex">
        <div className="h-fit w-full border-b px-4 py-8">
          <div className="mx-auto grid w-full max-w-5xl grid-cols-1 gap-4 md:grid-cols-12">
            <DailyGamesCard className="md:col-span-7" />
            <HexGamesCard className="md:col-span-5" />
          </div>
        </div>
      </main>
    </div>
  );
}
