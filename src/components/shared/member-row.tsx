import ProfileAvatar from "@/app/components/profile-avatar";
import { cn } from "@/lib/utils";
import React from "react";

export interface MemberRowProps {
  avatarUrl: string | null;
  displayName: string | null;
  username: string;
  faded?: boolean;
  icon?: React.ReactNode;
}

export function MemberRow({
  avatarUrl,
  displayName,
  username,
  faded,
  icon,
}: MemberRowProps) {
  return (
    <div className={cn("flex items-center gap-2", { "opacity-50": faded })}>
      <ProfileAvatar
        path={avatarUrl ?? "?"}
        fallback={username}
        className="size-10"
      />
      <div className="flex flex-col gap-0">
        <div className="flex items-center gap-1">
          {displayName}
          {icon}
        </div>
        <div className="text-xs opacity-40">@{username}</div>
      </div>
    </div>
  );
}

export function MemberRowSkeleton() {
  return (
    <div className="flex animate-pulse gap-2">
      <div className="bg-muted size-10 rounded-full" />
      <div className="flex flex-col gap-0">
        <div className="bg-muted h-4 w-24 rounded" />
        <div className="bg-muted/60 h-3 w-16 rounded" />
      </div>
    </div>
  );
}
