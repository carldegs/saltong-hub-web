import { notFound } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { getUserGroups } from "@/features/groups/queries/get-group";
import GroupListScreen from "@/features/groups/components/group-list-screen";
import { Navbar } from "@/components/shared/navbar";
import HomeNavbarBrand from "../components/home-navbar-brand";

/* TODO: Implement proper pagination. For now we'll fetch up to 50 groups then search is done client-side. */
export default async function GroupsPage() {
  const supabase = await createClient();
  const { data: claimData, error: claimDataError } =
    await supabase.auth.getClaims();

  if (!claimData || claimDataError) {
    return notFound();
  }

  const groups = await getUserGroups(supabase, claimData.claims.sub);

  return (
    <div className="grid h-dvh w-full grid-rows-[auto_auto_1fr]">
      <Navbar>
        <HomeNavbarBrand />
      </Navbar>
      <div className="mx-auto flex w-full max-w-[1800px] items-center justify-between gap-2 px-4 py-4">
        <GroupListScreen groups={groups} />
      </div>
    </div>
  );
}
