import { Metadata } from "next";
import getRound from "../../api/getRound";
import SaltongMainPageWithSuspense from "../components/templates/saltong-game-page";
import { GAME_SETTINGS } from "../../constants";

interface Props {
  searchParams: Promise<{ d?: string }>;
}

const SETTINGS = GAME_SETTINGS["saltong-max"];

export async function generateMetadata({
  searchParams: _searchParams,
}: Props): Promise<Metadata> {
  const searchParams = await _searchParams;
  const round = await getRound(SETTINGS.config.tableName, searchParams?.d);

  if (!round) {
    return {
      title: "Saltong Mini",
    };
  }

  return {
    title: `Saltong Max #${round?.gameId}`,
  };
}

export default async function SaltongMainPage(props: Props) {
  return (
    <SaltongMainPageWithSuspense
      searchParams={props.searchParams}
      {...SETTINGS}
    />
  );
}
