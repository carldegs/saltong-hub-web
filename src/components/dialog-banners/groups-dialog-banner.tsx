"use client";

import { useLocalStorage } from "usehooks-ts";
import { Button } from "@/components/ui/button";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";
import { UserPlus2, Users2Icon } from "lucide-react";
import Link from "next/link";

export function GroupsDialogBanner() {
  const STORAGE_KEY = "hide-dialog-banner/groups";
  const [hideBanner, setHideBanner] = useLocalStorage<boolean>(
    STORAGE_KEY,
    false
  );

  const handleCreateGroupClick = () => {
    setHideBanner(true);
  };

  if (hideBanner) {
    return null;
  }

  return (
    <div className="flex w-full max-w-lg flex-col gap-6">
      <Item
        variant="outline"
        className="border-pink-300 bg-linear-to-br from-pink-200 to-pink-100 py-6 text-pink-800 @xl:mt-20 @xl:mb-8 dark:from-pink-600/20 dark:to-pink-500/50 dark:text-pink-100"
      >
        <ItemMedia
          variant="icon"
          className="hidden border-pink-300 bg-pink-500/40 md:flex"
        >
          <Users2Icon />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>Ready to ignite some heated rivalries?</ItemTitle>
          <ItemDescription className="mt-0">
            Create a group to challenge friends and family and compare daily
            results.
          </ItemDescription>
        </ItemContent>
        <ItemActions>
          <Button size="icon" variant="outline" asChild>
            <Link href="/groups/create" onClick={handleCreateGroupClick}>
              <UserPlus2 />
            </Link>
          </Button>
        </ItemActions>
      </Item>
    </div>
  );
}
