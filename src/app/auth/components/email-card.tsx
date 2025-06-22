import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { emailSchema } from "../auth-schema";

interface EmailCardProps {
  onNext: (email: string) => void;
  onForgotPassword?: () => void;
}

export function EmailCard({ onNext, onForgotPassword }: EmailCardProps) {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function handleContinue() {
    setLoading(true);
    const result = emailSchema.safeParse({ email });
    if (!result.success) {
      setEmailError(result.error.errors[0].message);
      setLoading(false);
      return;
    }
    setEmailError(null);
    setLoading(false);
    onNext(email);
  }

  return (
    <>
      <p className="font-bold tracking-wider uppercase">
        Login or Create an Account
      </p>
      <Input
        type="email"
        placeholder="Email Address"
        className="h-12 w-full"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        disabled={loading}
        autoComplete="email"
      />
      <Button
        className="h-12 w-full"
        onClick={handleContinue}
        disabled={loading || !email}
      >
        Continue
      </Button>
      {emailError && <p className="text-sm text-red-500">{emailError}</p>}
      <div className="flex w-full justify-end">
        <button
          className="text-primary cursor-pointer text-sm hover:underline"
          type="button"
          onClick={onForgotPassword}
        >
          Forgot password?
        </button>
      </div>
    </>
  );
}
