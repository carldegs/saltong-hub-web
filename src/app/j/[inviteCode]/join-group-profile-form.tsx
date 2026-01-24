"use client";

import ProfileEditorForm from "@/features/profiles/components/profile-editor-form";
import { useInsertProfileMutation } from "@/features/profiles/hooks/profile";
import { Profile } from "@/features/profiles/types";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { JwtPayload } from "@supabase/supabase-js";
import { getTemporaryProfileFromClaims } from "@/features/profiles/utils";

interface JoinGroupProfileFormProps {
  claims: JwtPayload;
  groupId: string;
}

export default function JoinGroupProfileForm({
  claims,
}: JoinGroupProfileFormProps) {
  const router = useRouter();
  const insertProfileMutation = useInsertProfileMutation();

  const handleSubmit = async (
    data: Omit<Profile, "id" | "created_at" | "updated_at">
  ) => {
    // TODO: Implement joining the group after profile creation
    await insertProfileMutation.mutateAsync({
      id: claims.sub,
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

  const { username, avatar_url, display_name } =
    getTemporaryProfileFromClaims(claims) ?? {};

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
          avatar_url: avatar_url || "",
          display_name: display_name || "",
        }}
      />
    </div>
  );
}
