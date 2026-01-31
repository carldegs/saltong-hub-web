"use client";

import ProfileEditorForm from "@/features/profiles/components/profile-editor-form";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useInsertProfileAndJoinGroupMutation } from "@/features/groups/hooks/use-join-group";

interface JoinGroupProfileFormProps {
  username?: string;
  avatarUrl?: string;
  displayName?: string;
  avatarOptions?: { value: string; label?: string }[];
  userId: string;
  groupId: string;
  inviteCode: string;
}

export default function JoinGroupProfileForm({
  username,
  avatarUrl,
  displayName,
  avatarOptions,
  userId,
  groupId,
  inviteCode,
}: JoinGroupProfileFormProps) {
  const router = useRouter();
  const { mutateAsync, isPending } = useInsertProfileAndJoinGroupMutation();

  return (
    <div className="w-full max-w-md">
      <ProfileEditorForm
        onSubmit={async (data) => {
          try {
            await mutateAsync({
              profile: {
                ...data,
                id: userId,
              },
              groupMember: {
                userId,
                groupId,
              },
              inviteCode,
            });

            toast.success("Profile created successfully!");
            router.push(`/groups/${groupId}`);
          } catch (error) {
            let errorMessage = "Failed to create profile and join group";

            if (error instanceof Error) {
              errorMessage = error.message;
            }

            toast.error("Error creating profile and joining the group", {
              description: errorMessage,
            });

            throw error;
          }
        }}
        isLoading={isPending}
        submitText="Save Profile and Join"
        initialData={{
          username: username || "",
          avatar_url: avatarUrl || "",
          display_name: displayName || "",
        }}
        avatarOptions={avatarOptions}
      />
    </div>
  );
}
