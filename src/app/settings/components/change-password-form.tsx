"use client";

import { changePassword } from "@/features/auth/change-password";
import { signOutAfterPasswordChange } from "@/features/auth/sign-out-after-password-change";
import { useSupabaseClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function ChangePasswordForm() {
  const supabase = useSupabaseClient();
  const router = useRouter();
  const [currentPassword, setCurrentPassword] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setFormError(null);

    const result = await changePassword(supabase, {
      currentPassword,
      password,
      confirmPassword,
    });

    if (result.error) {
      setFormError(result.error);
      setIsSubmitting(false);
      return;
    }

    const signOutResult = await signOutAfterPasswordChange(supabase);

    if (!signOutResult.localSessionCleared) {
      setFormError(
        "Password changed, but this device could not be signed out. Please close this browser and sign in again."
      );
      setIsSubmitting(false);
      return;
    }

    setCurrentPassword("");
    setPassword("");
    setConfirmPassword("");
    toast.success("Password changed. Please sign in again.");
    router.replace(
      signOutResult.globalRevocationFailed
        ? "/auth?passwordChanged=1&sessionRevocationIncomplete=1"
        : "/auth?passwordChanged=1"
    );
  }

  return (
    <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
      <Input
        type="password"
        autoComplete="current-password"
        placeholder="Current Password"
        value={currentPassword}
        onChange={(event) => setCurrentPassword(event.target.value)}
        disabled={isSubmitting}
        required
      />
      <Input
        type="password"
        autoComplete="new-password"
        placeholder="New Password"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        disabled={isSubmitting}
        required
      />
      <Input
        type="password"
        autoComplete="new-password"
        placeholder="Confirm New Password"
        value={confirmPassword}
        onChange={(event) => setConfirmPassword(event.target.value)}
        disabled={isSubmitting}
        required
      />
      <p className="text-muted-foreground text-xs">
        Use at least 8 characters, including uppercase, lowercase, a number, and
        a special character.
      </p>
      {formError && <p className="text-sm text-red-500">{formError}</p>}
      <Button className="self-start" type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Changing Password..." : "Change Password"}
      </Button>
    </form>
  );
}
