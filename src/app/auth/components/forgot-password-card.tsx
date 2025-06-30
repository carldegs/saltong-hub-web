import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useSupabaseClient } from "@/lib/supabase/client";
import { getRedirectURL } from "@/lib/utils";

interface ForgotPasswordCardProps {
  onBack: () => void;
  initialEmail?: string;
}

export function ForgotPasswordCard({
  onBack,
  initialEmail = "",
}: ForgotPasswordCardProps) {
  const [email, setEmail] = useState(initialEmail);
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const supabase = useSupabaseClient();

  async function resetPassword() {
    setLoading(true);
    setError(null);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: getRedirectURL(),
    });
    setLoading(false);
    if (error) {
      setError(error.message);
    } else {
      setSent(true);
    }
  }

  if (sent) {
    return (
      <div className="flex flex-col items-center gap-4">
        <p className="text-center font-bold">
          Check your email for a password reset link.
        </p>
        <Button className="w-full" onClick={onBack}>
          Back to Login
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <p className="my-0 text-center font-bold tracking-widest uppercase">
        Forgot your password?
      </p>
      <p className="muted-foreground my-0 text-center">
        Enter your email address below and we&apos;ll send you a link to reset
        your password.
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
        onClick={resetPassword}
        disabled={loading || !email}
      >
        {loading ? "Sending..." : "Send Reset Email"}
      </Button>
      {error && <p className="text-center text-sm text-red-500">{error}</p>}
      <Button
        variant="outline"
        className="h-12 w-full"
        onClick={onBack}
        disabled={loading}
      >
        Back
      </Button>
    </div>
  );
}
