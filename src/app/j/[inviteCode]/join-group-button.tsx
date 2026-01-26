"use client";

import ProfileAvatar from "@/app/components/profile-avatar";
import { Button } from "@/components/ui/button";
import { useJoinGroup } from "@/features/groups/hooks/use-join-group";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function JoinGroupButton({
  avatarUrl,
  displayName,
  groupId,
  inviteCode,
}: {
  avatarUrl: string;
  displayName: string;
  groupId: string;
  inviteCode: string;
}) {
  const { mutate, isPending } = useJoinGroup();
  const router = useRouter();
  return (
    <Button
      size="lg"
      onClick={() => {
        mutate(
          { groupId, inviteCode },
          {
            onSuccess: () => {
              router.push(`/groups/${groupId}`);
            },
            onError: (error) => {
              console.error("Error joining group:", error);
              toast.error("Error joining group", {
                description: error.message,
              });
            },
          }
        );
      }}
      disabled={isPending}
    >
      <ProfileAvatar
        path={avatarUrl ?? ""}
        fallback={displayName ?? ""}
        className="size-6"
        fallbackClassName="size-6"
      />
      Join as
      <b className="-ml-1">{displayName ?? "User"}</b>
    </Button>
  );
}
