import { Metadata } from "next";
import { SALTONG_CONFIGS } from "../../constants";
import SaltongArchivePage from "../../components/archives/archives-page";

export const metadata: Metadata = {
  title: "Saltong Max Archives",
};

export default async function SaltongMaxArchivePage(props: {
  searchParams: Promise<{ d?: string }>;
}) {
  const searchParams = await props.searchParams;
  return (
    <SaltongArchivePage
      searchParams={searchParams}
      {...SALTONG_CONFIGS["max"]}
    />
  );
}
