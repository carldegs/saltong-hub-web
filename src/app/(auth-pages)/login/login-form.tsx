"use client";

import { useSearchParams } from "next/navigation";
import { useActionState } from "react";
import { login } from "../actions";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { AlertCircle } from "lucide-react";
import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import Link from "next/link";

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button
      className="w-full"
      type="submit"
      aria-disabled={pending}
      disabled={pending}
    >
      {pending ? "Authenticating..." : "Log in"}
    </Button>
  );
}
export default function LoginForm() {
  const currParams = useSearchParams();
  const from = currParams.get("f") ?? "";

  const [state, formAction] = useActionState(login.bind(null, from), {
    email: "",
    password: "",
    error: "",
  });

  return (
    <Card className="mx-auto w-full max-w-lg">
      <CardHeader>
        <CardTitle className="text-2xl">Log in</CardTitle>
      </CardHeader>
      <CardContent>
        {state.error && (
          <Alert variant="destructive" className="mb-4 bg-red-100/90">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{state.error}</AlertDescription>
          </Alert>
        )}
        <form className="space-y-4" action={formAction}>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" required />
          </div>
          <div>
            <Label htmlFor="password" className="mt-4">
              Password
            </Label>
            <Input id="password" name="password" type="password" required />
          </div>
          <div className="flex flex-col items-center justify-between gap-4 pt-4">
            <SubmitButton />
            <Link href="/signup" className="text-saltong-blue-400 underline">
              Don&apos;t have an account? Sign up
            </Link>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
