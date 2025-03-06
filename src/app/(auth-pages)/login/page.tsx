import { Navbar, NavbarBrand } from "@/components/shared/navbar";
import LoginForm from "./login-form";
import { createClient } from "@/lib/supabase/server";
import { redirect, RedirectType } from "next/navigation";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Saltong Hub | Log in",
};

export default async function LoginPage() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();

  if (data?.user) {
    redirect("/", RedirectType.replace);
  }

  return (
    <div className="grid min-h-screen w-full grid-rows-[auto_1fr] bg-muted">
      <Navbar>
        <NavbarBrand
          title="Saltong"
          subtitle="Hub"
          icon="/hub-light.svg"
          iconLight="/hub.svg"
        />
      </Navbar>
      <div className="flex h-full w-full items-center justify-center px-4">
        <LoginForm />
      </div>
    </div>
  );
}
