"use client";

import { Button } from "@/components/ui/button";
import { AuthCard } from "./components/auth-card";
import { EmailCard } from "./components/email-card";
import { PasswordCard } from "./components/password-card";
import { SignupCard } from "./components/signup-card";
import { ForgotPasswordCard } from "./components/forgot-password-card";
import { createClient } from "@/lib/supabase/client";
import { useState } from "react";

import GoogleIcon from "@/assets/auth/google.svg";
import DiscordIcon from "@/assets/auth/discord.svg";
import TwitterIcon from "@/assets/auth/twitter.svg";

export default function AuthForm({
  showSignup = false,
}: {
  showSignup?: boolean;
}) {
  const [step, setStep] = useState<
    "email" | "password" | "signup" | "forgot-password"
  >(showSignup ? "signup" : "email");
  const [email, setEmail] = useState("");
  const supabase = createClient();

  // Handle OAuth
  function handleOAuth(provider: "google" | "discord" | "twitter") {
    supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
  }

  return (
    <div className="bg-muted flex min-h-screen w-full grid-rows-[auto_1fr] items-center justify-center">
      <AuthCard>
        {step === "email" && (
          <>
            <EmailCard
              onNext={(userEmail) => {
                setEmail(userEmail);
                setStep("password");
              }}
              onForgotPassword={() => setStep("forgot-password")}
            />
            <div className="my-4 flex w-full items-center justify-center gap-2">
              <div className="bg-muted h-0.5 w-full" />
              <span className="text-muted-foreground mx-2 text-sm font-bold tracking-wider text-nowrap whitespace-nowrap uppercase">
                Or Login with
              </span>
              <div className="bg-muted h-0.5 w-full" />
            </div>
            <div className="flex w-full flex-col items-center justify-center gap-2 md:flex-row">
              <Button
                variant="secondary"
                className="min-h-12 w-full flex-1"
                onClick={() => handleOAuth("google")}
              >
                <GoogleIcon />
                Google
              </Button>
              <Button
                variant="secondary"
                className="min-h-12 w-full flex-1"
                onClick={() => handleOAuth("discord")}
              >
                <DiscordIcon />
                Discord
              </Button>
              <Button
                variant="secondary"
                className="min-h-12 w-full flex-1"
                onClick={() => handleOAuth("twitter")}
              >
                <TwitterIcon />
                Twitter
              </Button>
            </div>
          </>
        )}
        {step === "password" && (
          <>
            <PasswordCard
              email={email}
              onBack={() => setStep("email")}
              onForgotPassword={() => setStep("forgot-password")}
            />
          </>
        )}
        {step === "signup" && (
          <SignupCard
            onBack={() => setStep("email")}
            onSuccess={() => {
              supabase.auth.getUser();
              setStep("email");
            }}
          />
        )}
        {step === "forgot-password" && (
          <ForgotPasswordCard
            onBack={() => setStep(email ? "password" : "email")}
            initialEmail={email}
          />
        )}
        {step !== "signup" && (
          <div className="mt-4 flex w-full justify-center">
            <span className="text-muted-foreground text-sm">
              Don&apos;t have an account?
            </span>
            <button
              className="text-primary ml-2 text-sm font-bold hover:underline"
              type="button"
              onClick={() => setStep("signup")}
            >
              Sign up
            </button>
          </div>
        )}
      </AuthCard>
    </div>
  );
}
