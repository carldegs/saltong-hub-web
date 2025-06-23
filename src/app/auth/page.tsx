import { Metadata } from "next";
import AuthForm from "./auth-form";
import { createClient } from "@/lib/supabase/server";
import { redirect, RedirectType } from "next/navigation";

export const metadata: Metadata = {
  title: "Saltong Hub | Log in",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();

  if (data?.user) {
    redirect("/", RedirectType.replace);
  }

  const showSignup = (await searchParams)?.signup === "1";

  return <AuthForm showSignup={showSignup} />;
}
