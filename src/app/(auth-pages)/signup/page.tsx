import { Navbar, NavbarBrand } from "@/components/shared/navbar";
import SignupForm from "./signup-form";
import { Metadata } from "next";
import { redirect, RedirectType } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export const metadata: Metadata = {
  title: "Saltong Hub | Sign up",
};

export default async function SignupPage() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();

  if (data?.user) {
    redirect("/", RedirectType.replace);
  }

  return (
    <div className="bg-muted grid min-h-screen w-full grid-rows-[auto_1fr]">
      <Navbar>
        <NavbarBrand
          title="Saltong"
          subtitle="Hub"
          icon="/hub-light.svg"
          iconLight="/hub.svg"
        />
      </Navbar>
      <div className="flex h-full w-full items-center justify-center px-4">
        <SignupForm />
      </div>
    </div>
  );
}
