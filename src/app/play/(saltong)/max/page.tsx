import { Metadata } from "next";
import { generateSaltongMetadata } from "@/features/saltong/utils/generateSaltongMetadata";
import SaltongMainPageWithSuspense from "@/features/saltong/templates/saltong-game-page";

interface Props {
  searchParams: Promise<{ d?: string }>;
}

const MODE = "max";

export async function generateMetadata(props: Props): Promise<Metadata> {
  return generateSaltongMetadata({
    searchParams: props.searchParams,
    mode: MODE,
  });
}

export default async function SaltongMainPage(props: Props) {
  return (
    <SaltongMainPageWithSuspense
      searchParams={props.searchParams}
      mode={MODE}
    />
  );
}
