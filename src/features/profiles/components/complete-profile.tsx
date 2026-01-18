"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ReactNode } from "react";
import ProfileEditorForm from "./profile-editor-form";
import { useInsertProfileMutation } from "../hooks/profile";
import { toast } from "sonner";

export default function CompleteProfileDialog({
  children,
  username,
  avatarUrl,
  displayName,
  avatarOptions = [],
  userId,
  action = "close",
}: {
  children: ReactNode;
  username?: string;
  avatarUrl?: string;
  displayName?: string;
  avatarOptions?: { value: string; label?: string }[];
  userId: string;
  action?: "redirect" | "close";
}) {
  const { mutateAsync, isPending } = useInsertProfileMutation();

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader className="mb-3 gap-0">
          <DialogTitle className="mb-2 border-0 font-bold">
            Complete your profile to access social features!
          </DialogTitle>
          <DialogDescription className="mt-0">
            To access social features like your own profile page, achievements,
            leaderboards, and group competitions, please complete your profile.
          </DialogDescription>
        </DialogHeader>
        <ProfileEditorForm
          onSubmit={async (data) => {
            try {
              await mutateAsync({
                ...data,
                id: userId,
              });
              toast.success("Profile created successfully!");

              if (action === "redirect") {
                window.location.href = `/u/${data.username}`;
              } else {
                // Close the dialog by simulating a click on the overlay
                const overlay = document.querySelector(
                  '[data-slot="dialog-overlay"]'
                ) as HTMLElement;
                overlay?.click();
              }
            } catch (error) {
              let errorMessage = "An unknown error occurred";
              if (error instanceof Error) {
                errorMessage = error.message;
                // Check for unique constraint violation on username
                if (
                  error.message.includes(
                    "duplicate key value violates unique constraint"
                  )
                ) {
                  errorMessage = "Username already taken";
                }
              }
              toast.error("Error creating profile", {
                description: errorMessage,
              });
              throw error;
            }
          }}
          initialData={{
            username: username || "",
            avatar_url: avatarUrl || "",
            display_name: displayName || "",
          }}
          avatarOptions={avatarOptions}
          isLoading={isPending}
        />
      </DialogContent>
    </Dialog>
  );
}
