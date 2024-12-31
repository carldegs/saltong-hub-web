import { SALTONG_CONFIGS } from "../../constants";
import SaltongArchivePage from "@/features/archive/archives-page";

export default function SaltongMainArchivePage({
  searchParams,
}: {
  searchParams: { d?: string };
}) {
  return (
    <SaltongArchivePage
      searchParams={searchParams}
      {...SALTONG_CONFIGS["main"]}
    />
  );
}
