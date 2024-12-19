import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import Image from "next/image";
import Link from "next/link";
import { ColorModeToggle } from "@/components/shared/color-mode-toggle"; // Import ColorModeToggle

export const GAMES = [
  { href: "/play", icon: "/main.svg", name: "Saltong" },
  { href: "/play/max", icon: "/max.svg", name: "Saltong Max" },
  { href: "/play/mini", icon: "/mini.svg", name: "Saltong Mini" },
  { href: "/play/hex", icon: "/hex.svg", name: "Hex" },
];

export function GamesSidebarMenu() {
  return (
    <SidebarMenu>
      {GAMES.map((game) => (
        <SidebarMenuItem key={game.name}>
          <SidebarMenuButton className="h-auto">
            <Link href={game.href} className="flex w-full items-center gap-3">
              <Image
                src={game.icon}
                alt={`${game.name} Logo`}
                width={30}
                height={30}
              />
              <span className="text-lg">{game.name}</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}
