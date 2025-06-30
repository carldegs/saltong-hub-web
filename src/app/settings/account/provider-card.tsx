"use client";
import React from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import GoogleIcon from "@/assets/auth/google.svg";
import DiscordIcon from "@/assets/auth/discord.svg";
import TwitterIcon from "@/assets/auth/twitter.svg";
import { MailIcon, MoreVertical } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Menubar,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarItem,
} from "@/components/ui/menubar";
import { useSupabaseClient } from "@/lib/supabase/client";
import { UserIdentity } from "@supabase/supabase-js";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export interface ProviderCardProps {
  identity: UserIdentity;
  isMain: boolean;
  enableUnlink: boolean;
}

export default function ProviderCard({
  identity,
  isMain,
  enableUnlink,
}: ProviderCardProps) {
  const name =
    identity.identity_data?.full_name ||
    identity.identity_data?.name ||
    identity.identity_data?.preferred_username ||
    identity.identity_data?.user_name ||
    identity.identity_data?.email ||
    "Unknown";
  const email = identity.identity_data?.email;
  const avatar = identity.identity_data?.avatar_url;
  const router = useRouter();

  const [isUnlinking, setIsUnlinking] = React.useState(false);
  const supabase = useSupabaseClient();

  const handleUnlink = async () => {
    setIsUnlinking(true);
    try {
      await toast.promise(
        (async () => {
          const { data: identities, error: identitiesError } =
            await supabase.auth.getUserIdentities();
          if (!identitiesError) {
            const found = identities.identities.find(
              (i) => i.provider === identity.provider
            );
            if (found) {
              const { error } = await supabase.auth.unlinkIdentity(found);
              if (error) {
                throw error;
              }

              router.refresh();

              return;
            }
            throw new Error(
              `Identity with provider ${identity.provider} not found for unlinking`
            );
          } else {
            throw identitiesError;
          }
        })(),
        {
          loading: "Unlinking...",
          success: "Provider unlinked successfully!",
          error: (err) => err?.message || "Failed to unlink provider.",
        }
      );
    } finally {
      setIsUnlinking(false);
    }
  };

  // TODO: Add confirmation dialog before unlinking
  return (
    <div
      className={cn(
        "bg-muted/60 dark:bg-muted/60 flex items-center justify-between gap-4 rounded-lg border py-3 pr-2 pl-6",
        isMain &&
          "border-green-400 bg-green-400/20 dark:border-green-200 dark:bg-green-200/20"
      )}
    >
      <div className="flex min-w-0 flex-1 items-center gap-4">
        <div className="flex min-w-0 items-center gap-3">
          <Avatar className="size-10 border bg-white">
            <AvatarImage src={avatar} alt={name} />
            <AvatarFallback>{name[0]}</AvatarFallback>
          </Avatar>
          <div className="flex min-w-0 flex-col">
            <span className="truncate text-base font-medium">{name}</span>
            {email && (
              <span className="text-muted-foreground truncate text-xs">
                {email}
              </span>
            )}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-1">
        <span className="flex flex-col items-end justify-end gap-1 font-medium sm:min-w-[110px]">
          <span className="flex items-center gap-2">
            {identity.provider === "google" && (
              <GoogleIcon className="size-5" />
            )}
            {identity.provider === "discord" && (
              <DiscordIcon className="size-5" />
            )}
            {identity.provider === "twitter" && (
              <TwitterIcon className="size-5" />
            )}
            {identity.provider === "email" && <MailIcon className="size-5" />}
            <div className="hidden flex-col sm:flex">
              <span className="text-muted-foreground text-sm tracking-wide capitalize">
                {identity.provider}
              </span>
              {isMain && <span className="text-xs font-semibold">PRIMARY</span>}
            </div>
          </span>
        </span>
        {enableUnlink && (
          <Menubar className="h-auto border-none bg-transparent p-0 shadow-none">
            <MenubarMenu>
              <MenubarTrigger
                className="hover:bg-muted/40 h-auto w-auto cursor-pointer rounded p-2"
                disabled={isUnlinking}
              >
                <MoreVertical className="size-4" />
              </MenubarTrigger>
              <MenubarContent align="end" className="min-w-[120px]">
                <MenubarItem
                  onClick={handleUnlink}
                  disabled={isUnlinking}
                  className="text-foreground"
                >
                  Unlink
                </MenubarItem>
              </MenubarContent>
            </MenubarMenu>
          </Menubar>
        )}
      </div>
    </div>
  );
}
