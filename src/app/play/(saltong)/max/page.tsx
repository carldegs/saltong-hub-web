import SaltongGamePage from "../components/templates/saltong-game-page";
import { SALTONG_CONFIGS } from "../constants";

export default async function SaltongMainPage({
  searchParams,
}: {
  searchParams: { d?: string };
}) {
  return (
    <SaltongGamePage searchParams={searchParams} {...SALTONG_CONFIGS["max"]} />
  );
}
