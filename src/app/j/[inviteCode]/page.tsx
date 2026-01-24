import ProfileAvatar from "@/app/components/profile-avatar";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { getGroupByInviteCode } from "@/features/groups/actions";
import { UserIcon } from "lucide-react";
import Link from "next/link";
import JoinGroupProfileForm from "./join-group-profile-form";
import { redirect } from "next/navigation";
import { Navbar } from "@/components/shared/navbar";
import HomeNavbarBrand from "@/app/components/home-navbar-brand";

interface JoinGroupPageProps {
  params: Promise<{
    inviteCode: string;
  }>;
}

export default async function JoinGroupPage({ params }: JoinGroupPageProps) {
  const { inviteCode } = await params;

  const { group, claims, profile, isMember } =
    await getGroupByInviteCode(inviteCode);

  const userId = claims?.sub;

  if (isMember) {
    return redirect(`/groups/${group.id}`);
  }

  return (
    <div className="grid h-screen grid-rows-[auto_1fr]">
      <Navbar>
        <HomeNavbarBrand />
      </Navbar>
      <div className="relative h-full">
        <div className="flex h-full items-center justify-center">
          <Empty className="bg-card mx-auto max-w-xl px-4 md:border md:border-solid">
            <EmptyHeader className="gap-0">
              <EmptyMedia>
                <ProfileAvatar
                  profileType="group"
                  path={group.avatarUrl ?? ""}
                  fallback={group.name}
                  className="mx-auto size-12"
                />
              </EmptyMedia>
              <EmptyDescription>
                You&apos;re invited to join the group
              </EmptyDescription>
              <EmptyTitle className="text-xl font-bold">
                {group.name}
              </EmptyTitle>
              <EmptyDescription className="mt-0.5">
                <span className="flex items-center justify-center">
                  <UserIcon className="mr-1 size-4" />
                  {group.memberCount ?? 0} Member
                  {(group.memberCount ?? 0) !== 1 ? "s" : ""}
                </span>
              </EmptyDescription>
            </EmptyHeader>
            {!!userId && !!profile?.id && (
              <EmptyContent>
                {/* TODO: Handle joining the group */}
                <Button size="lg">
                  <ProfileAvatar
                    path={profile?.avatar_url ?? ""}
                    fallback={profile?.display_name ?? ""}
                    className="size-6"
                    fallbackClassName="size-6"
                  />
                  Join as
                  <b className="-ml-1">{profile?.display_name ?? "User"}</b>
                </Button>
              </EmptyContent>
            )}
            {!!userId && !profile?.id && (
              <EmptyContent className="w-full">
                <EmptyDescription className="mb-4 text-center">
                  Please complete your profile to join this group.
                </EmptyDescription>
                <JoinGroupProfileForm claims={claims} groupId={group.id} />
              </EmptyContent>
            )}
            {!userId && (
              <EmptyContent className="w-full space-y-3">
                <EmptyDescription className="text-center">
                  A Saltong account is required to join this group.
                </EmptyDescription>
                <div className="flex flex-col items-center justify-center gap-2 sm:flex-row">
                  <Button asChild size="lg" className="w-full sm:w-auto">
                    <Link
                      href={`/auth?signup=1&returnTo=${encodeURIComponent(
                        `/j/${inviteCode}`
                      )}`}
                    >
                      Sign up
                    </Link>
                  </Button>
                  <Button
                    asChild
                    variant="secondary"
                    size="lg"
                    className="w-full sm:w-auto"
                  >
                    <Link
                      href={`/auth?returnTo=${encodeURIComponent(
                        `/j/${inviteCode}`
                      )}`}
                    >
                      Log in
                    </Link>
                  </Button>
                </div>
              </EmptyContent>
            )}
          </Empty>
        </div>
        <div className="absolute top-0 -z-1 h-full w-full bg-[#F3F3F3]"></div>
      </div>
    </div>
  );
}
