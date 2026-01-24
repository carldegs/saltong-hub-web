import React from "react";
import { createClient } from "@/lib/supabase/server";
import {
  Card,
  CardHeader,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { Navbar } from "@/components/shared/navbar";
import HomeNavbarBrand from "@/app/components/home-navbar-brand";
import ProviderCard from "./provider-card";
import { notFound } from "next/navigation";
import AccountSettingsProfileForm from "../components/account-settings-profile-form";
import CompleteProfileDialog from "@/features/profiles/components/complete-profile";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { getProfileFormData } from "@/features/profiles/utils";

export default async function SettingsPage() {
  const supabase = await createClient();
  const { data: claimsData, error: claimsError } =
    await supabase.auth.getClaims();

  if (!claimsData?.claims || claimsError) {
    return notFound();
  }

  const { profile, isTemporaryProfile, avatarOptions, identitiesData } =
    (await getProfileFormData(supabase, claimsData.claims)) ?? {};

  return (
    <>
      <Navbar>
        <HomeNavbarBrand />
      </Navbar>
      <main className="dark:from-background dark:via-muted/60 dark:to-muted/80 relative flex min-h-[100dvh] items-start justify-center bg-gradient-to-br from-[#f8fafc] via-[#e0e7ef] to-[#f1f5f9] py-0 sm:py-8">
        <Card className="sm:bg-background mx-4 w-full max-w-xl rounded-none bg-none sm:rounded-lg">
          <CardHeader>
            <CardTitle className="text-2xl tracking-tighter">Account</CardTitle>
            <CardDescription className="-mt-1">
              Manage your Saltong Hub Account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <section>
              <h3 className="text-xl font-semibold">Profile</h3>
              <span className="text-muted-foreground mb-4 block text-sm">
                Update your profile information, including your username and
                avatar.
              </span>
              {!!profile && !isTemporaryProfile ? (
                <AccountSettingsProfileForm
                  profile={profile}
                  avatarOptions={avatarOptions ?? []}
                />
              ) : (
                <Alert>
                  <AlertTitle>Setup your Profile</AlertTitle>
                  <AlertDescription>
                    You haven&apos;t set up your profile yet. Please complete
                    your profile to access all social features.
                    <CompleteProfileDialog
                      userId={claimsData.claims.sub}
                      avatarOptions={avatarOptions}
                      username={profile?.username}
                      avatarUrl={profile?.avatar_url ?? ""}
                      displayName={profile?.display_name ?? ""}
                      action="close"
                    >
                      <Button className="mt-4">Complete Profile</Button>
                    </CompleteProfileDialog>
                  </AlertDescription>
                </Alert>
              )}
            </section>
            <section className="mt-8">
              <h3 className="text-xl font-semibold">Providers</h3>
              <span className="text-muted-foreground mb-4 block text-sm">
                These are the providers linked to your account. You can see
                which accounts you have connected and manage them here.
              </span>
              <div className="flex flex-col gap-2">
                {identitiesData?.identities?.map((identity) => (
                  <ProviderCard
                    key={identity.id}
                    identity={identity}
                    isMain={false}
                    enableUnlink={
                      !!(
                        identitiesData?.identities &&
                        identitiesData.identities?.length > 1
                      )
                    }
                  />
                ))}
              </div>
            </section>
          </CardContent>
        </Card>
      </main>
    </>
  );
}
