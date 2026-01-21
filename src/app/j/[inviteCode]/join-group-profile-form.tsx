"use client";

import ProfileEditorForm from "@/features/profiles/components/profile-editor-form";
import { useInsertProfileMutation } from "@/features/profiles/hooks/profile";
import { Profile } from "@/features/profiles/types";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { User } from "@supabase/supabase-js";
import { getSuggestedProfileFromUser } from "@/utils/user";

interface JoinGroupProfileFormProps {
  user: User;
  groupId: string;
}

export default function JoinGroupProfileForm({
  user,
}: JoinGroupProfileFormProps) {
  const router = useRouter();
  const insertProfileMutation = useInsertProfileMutation();

  const handleSubmit = async (
    data: Omit<Profile, "id" | "created_at" | "updated_at">
  ) => {
    // TODO: Implement joining the group after profile creation
    await insertProfileMutation.mutateAsync({
      id: user.id,
      ...data,
    });
  };

  const handleSuccess = () => {
    toast.success("Profile created successfully!");
    router.refresh();
  };

  const handleError = (error: Error) => {
    toast.error(error.message || "Failed to create profile");
  };

  const { username, avatarUrl, displayName } =
    getSuggestedProfileFromUser(user) ?? {};

  return (
    <div className="w-full max-w-md">
      <ProfileEditorForm
        onSubmit={handleSubmit}
        onSuccess={handleSuccess}
        onError={handleError}
        isLoading={insertProfileMutation.isPending}
        submitText="Save Profile and Join"
        initialData={{
          username: username || "",
          avatar_url: avatarUrl || "",
          display_name: displayName || "",
        }}
      />
    </div>
  );
}
