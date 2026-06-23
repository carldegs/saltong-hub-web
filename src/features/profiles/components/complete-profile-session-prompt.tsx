"use client";

import { useEffect, useState } from "react";
import CompleteProfileDialog from "./complete-profile";

const COMPLETE_PROFILE_PROMPT_SESSION_KEY = "complete-profile-prompt-shown";

export default function CompleteProfileSessionPrompt({
  userId,
  username,
  avatarUrl,
  displayName,
  avatarOptions,
}: {
  userId: string;
  username?: string;
  avatarUrl?: string;
  displayName?: string;
  avatarOptions?: { value: string; label?: string }[];
}) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem(COMPLETE_PROFILE_PROMPT_SESSION_KEY)) {
      return;
    }

    sessionStorage.setItem(COMPLETE_PROFILE_PROMPT_SESSION_KEY, "true");
    const timeoutId = window.setTimeout(() => setOpen(true), 0);

    return () => window.clearTimeout(timeoutId);
  }, []);

  return (
    <CompleteProfileDialog
      open={open}
      onOpenChange={setOpen}
      userId={userId}
      username={username}
      avatarUrl={avatarUrl}
      displayName={displayName}
      avatarOptions={avatarOptions}
      action="close"
    />
  );
}
