import React from "react";
import AccountSection from "./components/account-section";
import GeneralSection from "./components/general-section";
import AboutSection from "./components/about-section";
import SupportSection from "./components/support-section";
import { createClient } from "@/lib/supabase/server";
import {
  Card,
  CardHeader,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import BuildInfoSection from "./components/build-info-section";
import { Navbar } from "@/components/shared/navbar";
import HomeNavbarBrand from "../components/home-navbar-brand";

export default async function SettingsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <>
      <Navbar>
        <HomeNavbarBrand />
      </Navbar>

      <main className="dark:from-background dark:via-muted/60 dark:to-muted/80 relative flex min-h-[100dvh] items-center justify-center bg-gradient-to-br from-[#f8fafc] via-[#e0e7ef] to-[#f1f5f9] py-0 sm:py-8">
        <Card className="sm:bg-background w-full rounded-none bg-none pb-0 sm:mx-4 sm:max-w-xl sm:rounded-lg">
          <CardHeader>
            <CardTitle className="text-2xl tracking-tighter">
              Settings
            </CardTitle>
            <CardDescription className="-mt-1">
              Manage your Saltong Hub experience
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-0 px-0">
            <AccountSection user={user} />
            <GeneralSection />
            <AboutSection />
            <SupportSection />
            <BuildInfoSection />
          </CardContent>
        </Card>
      </main>
    </>
  );
}
