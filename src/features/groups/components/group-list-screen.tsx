"use client";
import { Input } from "@/components/ui/input";
import {
  ChevronRightIcon,
  PlusIcon,
  SearchIcon,
  Users2Icon,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import { Group } from "../types";
import { useState } from "react";
import { useDebounceCallback } from "usehooks-ts";
import ProfileAvatar from "@/app/components/profile-avatar";
import { Button } from "@/components/ui/button";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";

export default function GroupListScreen({ groups }: { groups: Group[] }) {
  const [searchInput, setSearchInput] = useState("");

  const [groupsData, setGroupsData] = useState<{ groups: Group[] }>({
    groups,
  });
  const [currentSearch, setCurrentSearch] = useState("");

  // Debounced search using useDebounceCallback
  const debouncedSearch = useDebounceCallback((value: string) => {
    const filteredGroups = groups.filter((group) =>
      group.name.toLowerCase().includes(value.toLowerCase())
    );
    setGroupsData({ groups: filteredGroups });
    setCurrentSearch(value);
  }, 150);

  // Call debounced search on input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
    debouncedSearch(e.target.value);
  };

  return (
    <div className="mx-auto w-full max-w-3xl">
      <div className="mb-6 flex items-center justify-between gap-4">
        <h1 className="mb-0 text-2xl font-bold">My Groups</h1>
        <Button asChild>
          <Link href="/groups/create">
            <PlusIcon />
            Create Group
          </Link>
        </Button>
      </div>

      {/* Search Bar */}
      <div className="relative mb-6">
        <SearchIcon className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
        <form
          onSubmit={(e) => {
            e.preventDefault();
          }}
          className="flex gap-2"
        >
          <Input
            placeholder="Search groups..."
            value={searchInput}
            onChange={handleInputChange}
            className="pl-10"
          />
        </form>
      </div>

      {/* Groups List */}
      <div className="flex w-full flex-col items-center justify-center gap-2">
        {groupsData?.groups && groupsData.groups.length > 0 ? (
          groupsData.groups.map((group) => (
            <Link
              key={group.id}
              href={`/groups/${group.id}`}
              className="w-full"
            >
              <Item
                variant="outline"
                className="cursor-pointer transition-colors hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                <ItemMedia variant="image">
                  <ProfileAvatar
                    path={group.avatarUrl ?? ""}
                    fallback={group.name}
                    profileType="group"
                    className="size-10"
                  />
                </ItemMedia>
                <ItemContent>
                  <ItemTitle>{group.name}</ItemTitle>
                  <ItemDescription className="mt-0 flex items-center gap-2">
                    <span className="flex items-center gap-2">
                      <Users2Icon className="size-4" /> {group.memberCount || 0}{" "}
                      member{group.memberCount === 1 ? "" : "s"}
                    </span>{" "}
                    |{" "}
                    <span className="flex items-center gap-2">
                      Joined{" "}
                      {formatDistanceToNow(new Date(group.createdAt), {
                        addSuffix: true,
                      })}
                    </span>
                  </ItemDescription>
                </ItemContent>
                <ItemActions>
                  <ChevronRightIcon className="h-5 w-5 text-gray-400" />
                </ItemActions>
              </Item>
            </Link>
          ))
        ) : (
          <div className="py-12 text-center">
            <p className="mb-4 text-gray-500">
              {currentSearch
                ? "No groups found matching your search."
                : "You haven't joined any groups yet."}
            </p>
            <Link
              href="/groups/create"
              className="inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
            >
              Create a Group
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
