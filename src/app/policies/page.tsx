import React from "react";
import type { Metadata } from "next";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Navbar } from "@/components/shared/navbar";
import HomeNavbarBrand from "../components/home-navbar-brand";
import {
  SettingsSectionHeader,
  SettingsSectionList,
  SettingsSectionItemLink,
} from "../settings/components/settings-section";

export const metadata: Metadata = {
  title: "Policies | Saltong Hub",
  description:
    "Review our privacy policy, cookie policy, and terms of service for Saltong Hub.",
  openGraph: {
    title: "Policies - Saltong Hub",
    description: "Review our policies and terms for using Saltong Hub.",
    type: "website",
    url: "https://saltong.com/policies",
  },
};

export default function PoliciesPage() {
  return (
    <>
      <Navbar>
        <HomeNavbarBrand />
      </Navbar>
      <main className="dark:from-background dark:via-muted/60 dark:to-muted/80 relative flex min-h-[100dvh] items-center justify-center bg-gradient-to-br from-[#f8fafc] via-[#e0e7ef] to-[#f1f5f9] py-0 sm:py-8">
        <Card className="sm:bg-background w-full rounded-none bg-none pb-0 sm:mx-4 sm:max-w-xl sm:rounded-lg">
          <CardHeader>
            <CardTitle className="text-2xl tracking-tighter">
              Policies
            </CardTitle>
            <CardDescription className="-mt-1">
              Review our policies and terms
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col px-0">
            <SettingsSectionHeader>Policies</SettingsSectionHeader>
            <SettingsSectionList>
              <SettingsSectionItemLink href="/policies/privacy">
                Privacy Policy
              </SettingsSectionItemLink>
              <SettingsSectionItemLink href="/policies/cookies">
                Cookie Policy
              </SettingsSectionItemLink>
              <SettingsSectionItemLink href="/policies/terms">
                Terms and Conditions
              </SettingsSectionItemLink>
            </SettingsSectionList>
          </CardContent>
        </Card>
      </main>
    </>
  );
}
