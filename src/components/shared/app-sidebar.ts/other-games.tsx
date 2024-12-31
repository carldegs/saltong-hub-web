import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import Image from "next/image";

export const OTHER_GAMES = [
  {
    href: "https://balitaoftheweek.com",
    icon: "/botw.png",
    name: "Balita of the Week",
  },
];

export function OtherGamesSidebarMenu() {
  return (
    <SidebarMenu>
      {OTHER_GAMES.map((game) => (
        <SidebarMenuItem key={game.name}>
          <SidebarMenuButton className="h-auto" asChild>
            <a
              href={game.href}
              className="flex w-full items-center gap-3"
              target="_blank"
            >
              <Image
                src={game.icon}
                alt={`${game.name} Logo`}
                width={32}
                height={32}
              />
              <span className="text-base">{game.name}</span>
            </a>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}
