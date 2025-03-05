import { Metadata } from "next";
import { SALTONG_CONFIGS } from "../constants";
import getRound from "../../api/getRound";
import SaltongMainPageWithSuspense from "../components/templates/saltong-game-page";

interface Props {
  searchParams: Promise<{ d?: string }>;
}

const CONFIG = SALTONG_CONFIGS["mini"];

export async function generateMetadata({
  searchParams: _searchParams,
}: Props): Promise<Metadata> {
  const searchParams = await _searchParams;
  const round = await getRound(CONFIG.tableName, searchParams?.d);

  if (!round) {
    return {
      title: "Saltong Mini",
    };
  }

  return {
    title: `Saltong Mini #${round?.gameId}`,
  };
}

export default async function SaltongMainPage(props: Props) {
  return (
    <SaltongMainPageWithSuspense
      searchParams={props.searchParams}
      {...CONFIG}
    />
  );
}
