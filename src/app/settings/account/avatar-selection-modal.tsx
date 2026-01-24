"use client";
import React, { useCallback, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import BoringAvatar from "boring-avatars";
import { RefreshCwIcon } from "lucide-react";
import {
  BORING_AVATAR_COLORS,
  getBoringAvatarUrl,
  isBoringAvatarUrl,
} from "@/utils/user";

interface AvatarSelectionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  email: string;
  currentAvatarUrl: string;
  avatarOptions: {
    value: string;
    label?: string;
  }[];
  onSelect: (avatarUrl: string) => void;
}

export default function AvatarSelectionModal({
  open,
  onOpenChange,
  email,
  currentAvatarUrl,
  avatarOptions,
  onSelect,
}: AvatarSelectionModalProps) {
  // Generate a random UUID for the generated avatar
  const generateUUID = () => crypto.randomUUID();

  // Get the initial generated avatar seed
  const getInitialGeneratedSeed = useCallback(() => {
    if (isBoringAvatarUrl(currentAvatarUrl)) {
      return currentAvatarUrl.slice(5);
    }
    return email;
  }, [currentAvatarUrl, email]);

  const [generatedAvatarSeed, setGeneratedAvatarSeed] = React.useState(
    getInitialGeneratedSeed()
  );
  const generatedAvatarUrl = getBoringAvatarUrl(generatedAvatarSeed);
  const defaultAvatar = currentAvatarUrl || generatedAvatarUrl;
  const [selectedAvatar, setSelectedAvatar] = React.useState(defaultAvatar);
  const selectedRef = React.useRef<HTMLButtonElement>(null);

  // Update selected avatar when modal opens with current value or default to generated
  useEffect(() => {
    if (open) {
      const initialSeed = getInitialGeneratedSeed();
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setGeneratedAvatarSeed(initialSeed);
      setSelectedAvatar(currentAvatarUrl || getBoringAvatarUrl(initialSeed));

      // TODO: Improve.
      // Scroll to selected avatar after a short delay to ensure DOM is ready
      setTimeout(() => {
        selectedRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }, 100);
    }
  }, [open, currentAvatarUrl, getInitialGeneratedSeed]);

  const handleRegenerateAvatar = () => {
    const newSeed = generateUUID();
    setGeneratedAvatarSeed(newSeed);
    setSelectedAvatar(getBoringAvatarUrl(newSeed));
  };

  const handleSave = () => {
    onSelect(selectedAvatar);
    onOpenChange(false);
  };

  const isGeneratedSelected = selectedAvatar === generatedAvatarUrl;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Select Avatar</DialogTitle>
          <DialogDescription>
            Choose an avatar from the options below or use your generated
            avatar.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-3 gap-4 py-4">
          {/* BoringAvatar option */}
          <div className="flex flex-col gap-2">
            <button
              ref={isGeneratedSelected ? selectedRef : null}
              type="button"
              onClick={() => setSelectedAvatar(generatedAvatarUrl)}
              className={cn(
                "hover:bg-accent flex w-full flex-col items-center gap-2 rounded-lg border-2 p-4 transition-all",
                isGeneratedSelected
                  ? "border-primary bg-accent"
                  : "border-border"
              )}
            >
              <BoringAvatar
                name={generatedAvatarSeed}
                variant="beam"
                size={80}
                colors={BORING_AVATAR_COLORS}
              />
              <span className="text-muted-foreground text-xs">Generated</span>
            </button>
            {isGeneratedSelected && (
              <Button
                type="button"
                size="sm"
                variant="outline"
                className="w-full gap-2"
                onClick={handleRegenerateAvatar}
              >
                <RefreshCwIcon className="size-3.5" />
                Randomize
              </Button>
            )}
          </div>

          {/* Image avatars */}
          {avatarOptions.map((option) => (
            <button
              key={option.value}
              ref={selectedAvatar === option.value ? selectedRef : null}
              type="button"
              onClick={() => setSelectedAvatar(option.value)}
              className={cn(
                "hover:bg-accent flex flex-col items-center gap-2 rounded-lg border-2 p-4 transition-all",
                selectedAvatar === option.value
                  ? "border-primary bg-accent"
                  : "border-border"
              )}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={option.value}
                alt={option.label ?? "avatar"}
                className="size-20 min-w-20 rounded-full border"
              />
              {option.label && (
                <span className="text-muted-foreground text-xs">
                  {option.label}
                </span>
              )}
            </button>
          ))}
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
