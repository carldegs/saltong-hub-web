"use client";
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSupabaseClient } from "@/lib/supabase/client";
import { MetadataProfile } from "@/utils/user";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import AvatarSelectionModal from "./avatar-selection-modal";
import ProfileAvatar from "@/app/components/profile-avatar";
import { InputGroup, InputGroupAddon } from "@/components/ui/input-group";
import { CheckIcon, PencilIcon, XIcon } from "lucide-react";
import { useRouter } from "next/navigation";

interface ProfileFormProps {
  username: string;
  avatarUrl: string;
  email: string;
  avatarOptions: {
    value: string;
    label?: string;
  }[];
}

export default function ProfileForm({
  username: initialUsername,
  avatarUrl: initialAvatarUrl,
  email,
  avatarOptions,
}: ProfileFormProps) {
  const [username, setUsername] = React.useState(initialUsername);
  const [avatarUrl, setAvatarUrl] = React.useState(initialAvatarUrl);
  const [isAvatarModalOpen, setIsAvatarModalOpen] = React.useState(false);
  const [isEditingUsername, setIsEditingUsername] = React.useState(false);
  const [isSavingUsername, setIsSavingUsername] = React.useState(false);
  const supabase = useSupabaseClient();
  const router = useRouter();

  async function handleSaveAvatar(newAvatarUrl: string) {
    setAvatarUrl(newAvatarUrl);

    const data: MetadataProfile = {
      selected_avatar_url: newAvatarUrl,
    };

    const { error } = await supabase.auth.updateUser({
      data,
    });

    if (error) {
      toast.error("Error updating avatar", {
        description: error.message,
      });
      // Revert on error
      setAvatarUrl(initialAvatarUrl);
    } else {
      toast.success("Avatar updated successfully");
      // Refresh server components to update sidebar
      router.refresh();
    }
  }

  async function handleSaveUsername() {
    if (username === initialUsername) {
      setIsEditingUsername(false);
      return;
    }

    setIsSavingUsername(true);

    const data: MetadataProfile = {
      selected_username: username,
    };

    const { error } = await supabase.auth.updateUser({
      data,
    });

    setIsSavingUsername(false);

    if (error) {
      toast.error("Error updating username", {
        description: error.message,
      });
      // Revert on error
      setUsername(initialUsername);
    } else {
      toast.success("Username updated successfully");
      setIsEditingUsername(false);
      // Refresh server components to update sidebar
      router.refresh();
    }
  }

  function handleCancelUsernameEdit() {
    setUsername(initialUsername);
    setIsEditingUsername(false);
  }

  return (
    <>
      <AvatarSelectionModal
        open={isAvatarModalOpen}
        onOpenChange={setIsAvatarModalOpen}
        email={email}
        currentAvatarUrl={avatarUrl}
        avatarOptions={avatarOptions}
        onSelect={handleSaveAvatar}
      />
      <form className="flex items-center gap-8">
        {(!!email || !!avatarUrl || avatarOptions?.length) && (
          <button
            type="button"
            onClick={() => setIsAvatarModalOpen(true)}
            className="border-border hover:border-primary hover:bg-accent flex flex-col items-center gap-4 rounded-lg border-2 p-4 transition-all"
          >
            <ProfileAvatar
              path={avatarUrl}
              fallback={email}
              className="size-20 cursor-pointer"
            />
            <span className="text-muted-foreground text-xs">Change Avatar</span>
          </button>
        )}
        <div className="flex flex-1 flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="username" className="text-sm font-medium">
              Username
            </Label>
            <InputGroup>
              <Input
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={!isEditingUsername}
                className={!isEditingUsername ? "bg-muted/50" : ""}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && isEditingUsername) {
                    handleSaveUsername();
                  } else if (e.key === "Escape" && isEditingUsername) {
                    handleCancelUsernameEdit();
                  }
                }}
              />
              <InputGroupAddon align="inline-end">
                {!isEditingUsername ? (
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    onClick={() => setIsEditingUsername(true)}
                  >
                    <PencilIcon className="size-4" />
                  </Button>
                ) : (
                  <div className="flex gap-1">
                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      onClick={handleSaveUsername}
                      disabled={isSavingUsername}
                    >
                      <CheckIcon className="size-4" />
                    </Button>
                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      onClick={handleCancelUsernameEdit}
                      disabled={isSavingUsername}
                    >
                      <XIcon className="size-4" />
                    </Button>
                  </div>
                )}
              </InputGroupAddon>
            </InputGroup>
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="email" className="text-sm font-medium">
              Email
            </Label>
            <Input id="email" value={email} disabled className="bg-muted/50" />
          </div>
        </div>
      </form>
    </>
  );
}
