"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { signupSchema } from "../auth-schema";
import { useSupabaseClient } from "@/lib/supabase/client";
import { getRedirectURL } from "@/lib/utils";

interface SignupCardProps {
  onBack: () => void;
  onSuccess: () => void;
  returnTo?: string;
}

export function SignupCard({ onBack, returnTo = "/" }: SignupCardProps) {
  const supabase = useSupabaseClient();
  const [email, setEmail] = useState("");
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
  const [showConfirmation, setShowConfirmation] = useState(false);

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

  async function handleSignup() {
    setIsSubmitting(true);
    const result = signupSchema.safeParse({ email, password, confirmPassword });
    if (!result.success) {
      setFormError(result.error.errors[0].message);
      setIsSubmitting(false);
      return;
    }
    setFormError(null);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${getRedirectURL()}auth/callback${
          returnTo && returnTo !== "/"
            ? `?returnTo=${encodeURIComponent(returnTo)}`
            : ""
        }`,
      },
    });
    if (error) {
      setFormError(error.message);
      setIsSubmitting(false);
      return;
    }
    setShowConfirmation(true);
    setIsSubmitting(false);
  }

  if (showConfirmation) {
    return (
      <div className="flex flex-col items-center justify-center gap-0 p-6">
        <p className="text-lg font-bold">Check your email</p>
        <p className="text-muted-foreground text-center">
          A confirmation email has been sent to{" "}
          <span className="font-semibold">{email}</span>. Please check your
          inbox and follow the instructions to complete your registration.
        </p>
        <Button className="mt-4 h-12 w-full" onClick={onBack}>
          Back to Login
        </Button>
      </div>
    );
  }

  return (
    <>
      <p className="font-bold tracking-wider uppercase">Sign up</p>
      <Input
        type="email"
        placeholder="Email Address"
        className="h-12 w-full"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        disabled={isSubmitting}
      />
      <Input
        type="password"
        placeholder="Password"
        className="h-12 w-full"
        value={password}
        onChange={(e) => handlePasswordChange(e.target.value)}
        disabled={isSubmitting}
      />
      <Input
        type="password"
        placeholder="Confirm Password"
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
        onClick={handleSignup}
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
            Signing up...
          </span>
        ) : (
          "Sign up"
        )}
      </Button>
      <Button
        variant="outline"
        className="w-full"
        onClick={onBack}
        disabled={isSubmitting}
      >
        Back
      </Button>
    </>
  );
}
