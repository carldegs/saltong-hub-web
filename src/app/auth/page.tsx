import { Metadata } from "next";
import AuthForm from "./auth-form";
import { createClient } from "@/lib/supabase/server";
import { redirect, RedirectType } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronLeftIcon } from "lucide-react";

export const metadata: Metadata = {
  title: "Saltong Hub | Log in",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();

  if (data?.user) {
    redirect("/", RedirectType.replace);
  }

  const showSignup = searchParams?.signup === "1";

  return (
    <div className="bg-muted relative flex min-h-screen w-full grid-rows-[auto_1fr] items-center justify-center">
      <Link href="/" className="absolute top-4 left-8 z-10">
        <Button variant="ghost" size="icon" aria-label="Back" asChild>
          <span>
            <ChevronLeftIcon className="size-5" />
            Back
          </span>
        </Button>
      </Link>
      <AuthForm showSignup={showSignup} />
    </div>
  );
}
