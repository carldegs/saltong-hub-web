import HomeNavbarBrand from "@/app/components/home-navbar-brand";
import ProfileAvatar from "@/app/components/profile-avatar";
import { Navbar } from "@/components/shared/navbar";
import GroupMembersDialog from "../components/group-members-dialog";
import GroupLeaderboards from "@/features/groups/components/group-leaderboards";
import InviteMembers from "@/features/groups/components/invite-members";
import { getGroupById } from "@/features/groups/queries/get-group";
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";

interface GroupPageProps {
  params: Promise<{
    groupId: string;
  }>;
}

export default async function GroupPage({ params }: GroupPageProps) {
  const { groupId } = await params;
  const supabase = await createClient();

  const { data: group, error } = await getGroupById(supabase, groupId);
  const { data: claimData, error: claimDataError } =
    await supabase.auth.getClaims();

  if (!claimData || claimDataError) {
    return notFound();
  }

  if (error || !group) {
    return (
      <div className="flex h-screen items-center justify-center">
        Group not found
      </div>
    );
  }

  return (
    <div className="grid h-dvh w-full grid-rows-[auto_auto_1fr]">
      <Navbar>
        <HomeNavbarBrand />
      </Navbar>
      <div className="flex max-w-full items-center justify-between gap-2 px-8 py-4">
        <div className="flex items-center gap-2">
          <ProfileAvatar
            path={group.avatarUrl ?? ""}
            fallback={group.name}
            profileType="group"
            className="size-8"
          />
          <h4 className="w-full max-w-60 overflow-hidden text-ellipsis">
            {group.name}
          </h4>
        </div>
        <GroupMembersDialog
          groupName={group.name}
          groupId={groupId}
          userId={claimData.claims.sub}
          inviteCode={group.inviteCode}
        />
      </div>
      {(group.memberCount ?? 0) > 1 ? (
        <GroupLeaderboards
          groupId={group.id}
          currentUserId={claimData.claims.sub}
        />
      ) : (
        <InviteMembers {...group} />
      )}
    </div>
  );
}
