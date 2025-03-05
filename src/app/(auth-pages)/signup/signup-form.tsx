"use client";

import { useActionState } from "react";
import { signup } from "../actions";
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
      {pending ? "Authenticating..." : "Login"}
    </Button>
  );
}
export default function SignupForm() {
  const [state, formAction] = useActionState(signup, {
    email: "",
    password: "",
    confirmPassword: "",
    errors: {
      email: [],
      password: [],
      confirmPassword: [],
      main: [],
    },
  });

  return (
    <Card className="mx-auto mt-10 w-full max-w-lg p-4">
      <CardHeader>
        <CardTitle>Login</CardTitle>
      </CardHeader>
      <CardContent>
        {state?.errors?.main?.length && (
          <Alert variant="destructive" className="mb-4 bg-red-100/90">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{state.errors.main[0]}</AlertDescription>
          </Alert>
        )}
        <form className="space-y-4" action={formAction}>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" required />
            {!!state?.errors?.email?.length && (
              <span>{state.errors.email[0]}</span>
            )}
          </div>
          <div>
            <Label htmlFor="password" className="mt-4">
              Password
            </Label>
            <Input id="password" name="password" type="password" required />
            {!!state?.errors?.password?.length && (
              <span>{state.errors.password[0]}</span>
            )}
          </div>
          <div>
            <Label htmlFor="confirmPassword" className="mt-4">
              Confirm Password
            </Label>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              required
            />
            {!!state?.errors?.confirmPassword?.length && (
              <span>{state.errors.confirmPassword[0]}</span>
            )}
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
