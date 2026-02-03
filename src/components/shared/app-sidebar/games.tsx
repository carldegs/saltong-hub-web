import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import Image from "next/image";
import HoverPrefetchLink from "../hover-prefetch-link";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  VaultIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  // CrownIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const getDefaultSubItems = (path: string) => {
  return [
    {
      href: `${path}/vault`,
      name: "Vault",
      icon: <VaultIcon />,
    },
    // {
    //   href: `${path}/leaderboards`,
    //   name: "Leaderboards",
    //   icon: <CrownIcon />,
    // },
  ];
};
export const GAMES = [
  {
    href: "/play",
    icon: "/main.svg",
    name: "Saltong",
    sub: getDefaultSubItems("/play"),
  },
  {
    href: "/play/max",
    icon: "/max.svg",
    name: "Saltong Max",
    sub: getDefaultSubItems("/play/max"),
  },
  {
    href: "/play/mini",
    icon: "/mini.svg",
    name: "Saltong Mini",
    sub: getDefaultSubItems("/play/mini"),
  },
  {
    href: "/play/hex",
    icon: "/hex.svg",
    name: "Hex",
    sub: getDefaultSubItems("/play/hex"),
  },
];

export function GamesSidebarMenu() {
  return (
    <SidebarMenu className="gap-0.5">
      {GAMES.map((game) => (
        <Collapsible className="group/collapsible" key={game.name}>
          <SidebarMenuItem>
            <div className="flex items-center">
              <SidebarMenuButton className="h-auto">
                <HoverPrefetchLink
                  href={game.href}
                  className="flex w-full items-center gap-3"
                >
                  {game.icon && (
                    <Image
                      src={game.icon}
                      alt={`${game.name} Logo`}
                      width={28}
                      height={28}
                    />
                  )}
                  <span className="text-base">{game.name}</span>
                </HoverPrefetchLink>
              </SidebarMenuButton>
              <CollapsibleTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="opacity-70 hover:opacity-100"
                >
                  <ChevronRightIcon className="group-data-[state=open]/collapsible:hidden" />
                  <ChevronDownIcon className="group-data-[state=closed]/collapsible:hidden" />
                </Button>
              </CollapsibleTrigger>
            </div>
            <CollapsibleContent>
              <SidebarMenuSub>
                {game.sub?.map((subItem) => (
                  <SidebarMenuSubItem key={subItem.href}>
                    <SidebarMenuButton asChild>
                      <HoverPrefetchLink
                        href={subItem.href}
                        className="flex w-full items-center gap-3"
                      >
                        {subItem.icon}
                        <span className="text-sm">{subItem.name}</span>
                      </HoverPrefetchLink>
                    </SidebarMenuButton>
                  </SidebarMenuSubItem>
                ))}
              </SidebarMenuSub>
            </CollapsibleContent>
          </SidebarMenuItem>
        </Collapsible>
      ))}
    </SidebarMenu>
  );
}
