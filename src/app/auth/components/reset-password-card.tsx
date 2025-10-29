"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { passwordSchema } from "../auth-schema";
import { useSupabaseClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { AuthCard } from "./auth-card";
import { getRedirectURL } from "@/lib/utils";

export function ResetPasswordCard() {
  const supabase = useSupabaseClient();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const [passwordStatus, setPasswordStatus] = useState({
    length: false,
    lower: false,
    upper: false,
    number: false,
    special: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const router = useRouter();

  function handlePasswordChange(value: string) {
    setPassword(value);
    setPasswordStatus({
      length: value.length >= 8,
      lower: /[a-z]/.test(value),
      upper: /[A-Z]/.test(value),
      number: /[0-9]/.test(value),
      special: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(value),
    });
  }

  async function handleReset() {
    setIsSubmitting(true);
    const result = passwordSchema.safeParse(password);
    if (!result.success) {
      setFormError(result.error.errors[0].message);
      setIsSubmitting(false);
      return;
    }
    if (password !== confirmPassword) {
      setFormError("Passwords do not match");
      setIsSubmitting(false);
      return;
    }
    setFormError(null);
    const { error } = await supabase.auth.updateUser(
      { password },
      {
        emailRedirectTo: getRedirectURL(),
      }
    );
    if (error) {
      setFormError(error.message);
      setIsSubmitting(false);
      return;
    }
    setShowSuccess(true);
    setIsSubmitting(false);
    router.push("/");
  }

  if (showSuccess) {
    return (
      <div className="flex flex-col items-center justify-center gap-0 p-6">
        <p className="text-lg font-bold">Password updated!</p>
      </div>
    );
  }

  return (
    <AuthCard>
      <p className="font-bold tracking-wider uppercase">Reset Password</p>
      <Input
        type="password"
        placeholder="New Password"
        className="h-12 w-full"
        value={password}
        onChange={(e) => handlePasswordChange(e.target.value)}
        disabled={isSubmitting}
      />
      <Input
        type="password"
        placeholder="Confirm New Password"
        className="h-12 w-full"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        disabled={isSubmitting}
      />
      <div className="mt-2 w-full text-xs">
        <div>Password must have:</div>
        <ul className="ml-4 list-disc">
          <li
            className={
              passwordStatus.length ? "text-green-600" : "text-muted-foreground"
            }
          >
            At least 8 characters
          </li>
          <li
            className={
              passwordStatus.lower ? "text-green-600" : "text-muted-foreground"
            }
          >
            Lowercase letter
          </li>
          <li
            className={
              passwordStatus.upper ? "text-green-600" : "text-muted-foreground"
            }
          >
            Uppercase letter
          </li>
          <li
            className={
              passwordStatus.number ? "text-green-600" : "text-muted-foreground"
            }
          >
            Number
          </li>
          <li
            className={
              passwordStatus.special
                ? "text-green-600"
                : "text-muted-foreground"
            }
          >
            Special character (!@#$%^&*()_+-=[]{};&apos;:&quot;|,.&lt;&gt;/?)
          </li>
        </ul>
      </div>
      <div className="h-6">
        {formError && <span className="text-sm text-red-500">{formError}</span>}
      </div>
      <Button
        className="h-12 w-full"
        onClick={handleReset}
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <span className="flex items-center justify-center gap-2">
            <svg
              className="h-5 w-5 animate-spin text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8z"
              ></path>
            </svg>
            Updating...
          </span>
        ) : (
          "Update Password"
        )}
      </Button>
    </AuthCard>
  );
}
