import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import Image from "next/image";
import HoverPrefetchLink from "../hover-prefetch-link";

export const GAMES = [
  { href: "/play", icon: "/main.svg", name: "Saltong" },
  { href: "/play/max", icon: "/max.svg", name: "Saltong Max" },
  { href: "/play/mini", icon: "/mini.svg", name: "Saltong Mini" },
  { href: "/play/hex", icon: "/hex.svg", name: "Hex" },
];

export function GamesSidebarMenu() {
  return (
    <SidebarMenu className="gap-0.5">
      {GAMES.map((game) => (
        <SidebarMenuItem key={game.name}>
          <SidebarMenuButton className="h-auto" asChild>
            <HoverPrefetchLink
              href={game.href}
              className="flex w-full items-center gap-3"
            >
              {game.icon && (
                <Image
                  src={game.icon}
                  alt={`${game.name} Logo`}
                  width={32}
                  height={32}
                />
              )}
              <span className="text-base">{game.name}</span>
            </HoverPrefetchLink>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}
