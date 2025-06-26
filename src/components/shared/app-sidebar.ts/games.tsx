import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import Image from "next/image";
import Link from "next/link";

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
            <Link
              href={game.href}
              className="flex w-full items-center gap-3"
              prefetch={false}
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
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}
