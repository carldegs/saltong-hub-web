import { Metadata } from "next";
import AuthForm from "./auth-form";
import { createClient } from "@/lib/supabase/server";
import { redirect, RedirectType } from "next/navigation";
import { validateRedirect } from "@/lib/auth/validate-redirect";

export const metadata: Metadata = {
  title: "Saltong Hub | Log in",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();

  if (data?.claims) {
    redirect("/", RedirectType.replace);
  }

  const params = await searchParams;
  const showSignup = params?.signup === "1";
  const returnTo = validateRedirect(
    typeof params?.returnTo === "string" ? params.returnTo : undefined
  );

  return <AuthForm showSignup={showSignup} returnTo={returnTo} />;
}
