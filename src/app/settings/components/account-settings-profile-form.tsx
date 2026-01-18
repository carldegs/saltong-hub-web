"use client";

import ProfileEditorForm from "@/features/profiles/components/profile-editor-form";
import { useUpdateProfileMutation } from "@/features/profiles/hooks/profile";
import { Profile } from "@/features/profiles/types";
import { toast } from "sonner";

export default function AccountSettingsProfileForm({
  profile,
  avatarOptions,
}: {
  profile?: Profile;
  avatarOptions: { value: string; label?: string }[];
}) {
  const { mutateAsync, isPending } = useUpdateProfileMutation();
  return (
    <>
      <ProfileEditorForm
        onSubmit={async (data) => {
          try {
            await mutateAsync({
              ...data,
              id: profile?.id || "",
            });
            toast.success("Profile updated successfully!");
          } catch (error) {
            let errorMessage = "Unknown error";
            if (error instanceof Error) {
              errorMessage = error.message;
              if (
                error.message.includes(
                  "duplicate key value violates unique constraint"
                )
              ) {
                errorMessage = "Username already taken";
              }
            }
            toast.error("Error updating profile", {
              description: errorMessage,
              position: "top-right",
            });
            throw error;
          }
        }}
        initialData={{
          username: profile?.username ?? "",
          avatar_url: profile?.avatar_url ?? "",
          display_name: profile?.display_name ?? "",
        }}
        avatarOptions={avatarOptions}
        isLoading={isPending}
      />
    </>
  );
}
