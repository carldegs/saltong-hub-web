import { Metadata } from "next";
import getRound from "../../api/getRound";
import SaltongMainPageWithSuspense from "../components/templates/saltong-game-page";
import { GAME_SETTINGS } from "../../constants";

interface Props {
  searchParams: Promise<{ d?: string }>;
}

const CONFIG = GAME_SETTINGS["saltong-main"];

export async function generateMetadata({
  searchParams: _searchParams,
}: Props): Promise<Metadata> {
  const searchParams = await _searchParams;
  const round = await getRound(CONFIG.config.tableName, searchParams?.d);

  if (!round) {
    return {
      title: "Saltong",
    };
  }

  return {
    title: `Saltong #${round?.gameId}`,
  };
}

export default async function SaltongMainPage(props: {
  searchParams: Promise<{ d?: string }>;
}) {
  return (
    <SaltongMainPageWithSuspense
      searchParams={props.searchParams}
      {...CONFIG}
    />
  );
}
