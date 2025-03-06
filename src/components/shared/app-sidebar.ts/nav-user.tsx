"use client";

import { BadgeCheck, ChevronsUpDown, LogOut } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { signOut } from "@/app/(auth-pages)/actions";
import { usePathname } from "next/navigation";

export function NavUser({
  user,
}: {
  user?: Partial<{
    name: string;
    email: string;
    avatar: string;
  }>;
}) {
  const { isMobile, setOpenMobile } = useSidebar();
  const currPathname = usePathname();

  if (!user?.email && !user?.name && !user?.avatar) {
    // show Log in/Sign up button
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <div className="grid grid-cols-2 gap-2">
            <Button
              size="lg"
              onClick={() => {
                setOpenMobile(false);
              }}
              asChild
            >
              <Link
                href={{
                  pathname: "/login",
                  query: { f: currPathname },
                }}
              >
                Log in
              </Link>
            </Button>
            <Button size="lg" variant="secondary">
              <Link href="/signup">Sign up</Link>
            </Button>
          </div>
        </SidebarMenuItem>
      </SidebarMenu>
    );
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="rounded-lg">
                  {user.name?.charAt(0).toUpperCase() ??
                    user.email?.charAt(0).toUpperCase() ??
                    "?"}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">
                  {user.name ?? user.email}
                </span>
                {user.name && (
                  <span className="truncate text-xs">{user.email}</span>
                )}
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">{user.name}</span>
                  <span className="truncate text-xs">{user.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <Link href="/account" className="w-full">
                  <BadgeCheck className="mr-4 inline size-5" />
                  Account
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={signOut}>
                <LogOut className="mr-4 size-5" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
