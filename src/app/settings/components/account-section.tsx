"use client";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { User } from "@supabase/supabase-js";
import { getUserProfile } from "@/utils/user";
import ProfileAvatar from "@/app/components/profile-avatar";

export default function AccountSection({ user }: { user?: User | null }) {
  const profile = getUserProfile(user);

  if (!profile) {
    return null;
  }

  return (
    <section className="px-6 pb-4">
      <Link
        href="/settings/account"
        className="group hover:bg-accent/40 flex w-full items-center gap-4 rounded-xl border p-4 shadow-sm transition"
      >
        <div className="flex items-center gap-3">
          <ProfileAvatar
            path={profile.avatarUrl}
            fallback={profile.email}
            className="border-primary size-12 border-2 shadow"
          />

          <div className="flex flex-col justify-center">
            <span className="group-hover:text-primary text-base font-semibold transition-colors">
              {profile.username}
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
