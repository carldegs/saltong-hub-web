import { ChevronRight } from "lucide-react";
import Link from "next/link";
import ProfileAvatar from "@/app/components/profile-avatar";
import { createClient } from "@/lib/supabase/server";
import { getProfileById } from "@/features/profiles/queries/get-profile";
import { getTemporaryProfileFromClaims } from "@/features/profiles/utils";

export default async function AccountSection() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();

  if (!data?.claims?.sub) {
    return null;
  }

  const { data: profileData } = await getProfileById(
    supabase,
    data.claims.sub || ""
  );

  const profile = profileData ?? getTemporaryProfileFromClaims(data.claims);

  return (
    <section className="px-6 pb-4">
      <Link
        href="/settings/account"
        className="group hover:bg-accent/40 flex w-full items-center gap-4 rounded-xl border p-4 shadow-sm transition"
      >
        <div className="flex items-center gap-3">
          <ProfileAvatar
            path={profile.avatar_url ?? ""}
            fallback={profile.username}
            className="border-primary size-12 border-2 shadow"
          />

          <div className="flex flex-col justify-center">
            <span className="group-hover:text-primary text-base font-semibold transition-colors">
              @{profile.username}
            </span>
            <span className="text-muted-foreground text-xs">
              View account details
            </span>
          </div>
        </div>
        <ChevronRight className="text-muted-foreground group-hover:text-primary ml-auto h-6 w-6 transition-colors" />
      </Link>
    </section>
  );
}
