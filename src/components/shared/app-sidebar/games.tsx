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
import { VaultIcon, ChevronDownIcon, ChevronRightIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SUDOKU_MODES } from "@/features/sudoku/config";
import {
  getSudokuDifficultySelectorPath,
  getSudokuGamePath,
  getSudokuVaultPath,
} from "@/features/sudoku/paths";
import NewFeatureBadge from "../new-feature-badge";

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

const SUDOKU_SUB_ITEMS = [
  ...Object.values(SUDOKU_MODES).map(({ mode, displayName, icon: Icon }) => ({
    href: `/play${getSudokuGamePath(mode)}`,
    name: displayName,
    icon: <Icon />,
  })),
  {
    href: `/play${getSudokuVaultPath()}`,
    name: "Vault",
    icon: <VaultIcon />,
  },
];

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
  {
    href: `/play${getSudokuDifficultySelectorPath()}`,
    icon: "/sudoku.svg",
    name: "Sudoku",
    isNew: true,
    sub: SUDOKU_SUB_ITEMS,
  },
  {
    href: "/play/mathinik",
    icon: "/mathinik.svg",
    name: "Mathinik",
    isNew: true,
    sub: getDefaultSubItems("/play/mathinik"),
  },
];

export function GamesSidebarMenu() {
  return (
    <SidebarMenu className="gap-0.5">
      {GAMES.map((game) => (
        <Collapsible asChild className="group/collapsible" key={game.name}>
          <SidebarMenuItem>
            <div className="flex items-center">
              <SidebarMenuButton className="h-auto" asChild>
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
                  <span className="flex items-center justify-center text-base">
                    {game.name} {game.isNew && <NewFeatureBadge />}
                  </span>
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
