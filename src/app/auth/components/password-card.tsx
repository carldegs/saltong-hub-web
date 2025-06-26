import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRef, useEffect, useState } from "react";
import { passwordSchema } from "../auth-schema";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

interface PasswordCardProps {
  email: string;
  onBack: () => void;
  onForgotPassword?: () => void;
}

export function PasswordCard({
  email,
  onBack,
  onForgotPassword,
}: PasswordCardProps) {
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();
  const passwordInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    passwordInputRef.current?.focus();
  }, []);

  async function signInWithEmail() {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { data, error };
  }

  async function handleLogin() {
    setLoading(true);
    setError(null);
    const result = passwordSchema.safeParse(password);
    if (!result.success) {
      setPasswordError(result.error.errors[0].message);
      setLoading(false);
      return;
    }
    setPasswordError(null);
    const { error } = await signInWithEmail();
    setLoading(false);
    if (error) {
      setError(error.message);
    } else {
      router.refresh();
    }
  }

  return (
    <>
      <p className="font-bold tracking-widest uppercase">
        LOGIN TO YOUR ACCOUNT
      </p>
      <Input
        type="email"
        placeholder="Email"
        className="h-12 w-full"
        value={email}
        disabled={true}
      />
      <Input
        type="password"
        placeholder="Password"
        className="mb-4 h-12 w-full"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        disabled={loading}
        ref={passwordInputRef}
      />
      <Button
        className="h-12 w-full"
        onClick={handleLogin}
        disabled={loading || !password}
      >
        {loading && (
          <svg
            className="mr-2 inline h-4 w-4 animate-spin text-white"
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
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v8z"
            />
          </svg>
        )}
        Log in
      </Button>
      <div className="flex w-full justify-end">
        <button
          className="text-primary cursor-pointer text-sm hover:underline"
          type="button"
          onClick={onForgotPassword}
        >
          Forgot password?
        </button>
      </div>
      <div className="h-6">
        {(passwordError || error) && (
          <span className="text-sm text-red-500">{passwordError || error}</span>
        )}
      </div>
      <Button
        variant="outline"
        className="w-full"
        onClick={onBack}
        disabled={loading}
      >
        Back
      </Button>
    </>
  );
}
