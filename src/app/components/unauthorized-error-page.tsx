"use client";

import { Navbar, NavbarBrand } from "@/components/shared/navbar";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ComponentProps } from "react";
import { usePathname } from "next/navigation";
import { Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import { GameSettings } from "../play/types";

export default function UnauthorizedErrorPage(
  gameSettings: Pick<GameSettings, "colorScheme" | "name" | "icon">
) {
  const { colorScheme, name, icon } = gameSettings;
  const currPathname = usePathname();

  return (
    <>
      <Navbar
        colorScheme={
          colorScheme as ComponentProps<typeof Navbar>["colorScheme"]
        }
      >
        <NavbarBrand
          colorScheme={
            colorScheme as ComponentProps<typeof Navbar>["colorScheme"]
          }
          icon={icon}
          name={name}
        />
      </Navbar>
      <div
        className={cn(
          "flex h-[calc(100vh-4rem)] items-center justify-center bg-gradient-to-br",
          {
            "from-saltong-green-400/20 to-background dark:from-saltong-green-900/20":
              colorScheme === "green",
            "from-saltong-blue-400/20 to-background dark:from-saltong-blue-900/20":
              colorScheme === "blue",
            "from-saltong-purple-400/20 to-background dark:from-saltong-purple-900/20":
              colorScheme === "purple",
            "from-saltong-red-400/20 to-background dark:from-saltong-red-900/20":
              colorScheme === "red",
            "from-blue-50 via-white to-pink-100 dark:from-zinc-900 dark:via-zinc-950 dark:to-zinc-900":
              !(
                colorScheme === "green" ||
                colorScheme === "blue" ||
                colorScheme === "purple" ||
                colorScheme === "red"
              ),
          }
        )}
      >
        <div className="mx-4 flex w-full max-w-lg flex-col items-center rounded-2xl border border-zinc-200 bg-white/80 p-8 text-center shadow-xl dark:border-zinc-800 dark:bg-zinc-900/80">
          <div
            className={cn(
              "x-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full",
              {
                "bg-saltong-green-100": colorScheme === "green",
                "bg-saltong-blue-100": colorScheme === "blue",
                "bg-saltong-purple-100": colorScheme === "purple",
                "bg-saltong-red-100": colorScheme === "red",
                "bg-pink-100 dark:bg-zinc-800": !(
                  "green" === colorScheme ||
                  "blue" === colorScheme ||
                  "purple" === colorScheme ||
                  "red" === colorScheme
                ),
              }
            )}
          >
            <Lock
              className={cn("h-8 w-8", {
                "text-saltong-green-600": colorScheme === "green",
                "text-saltong-blue-600": colorScheme === "blue",
                "text-saltong-purple-600": colorScheme === "purple",
                "text-saltong-red-600": colorScheme === "red",
                "text-pink-500 dark:text-pink-400": !(
                  "green" === colorScheme ||
                  "blue" === colorScheme ||
                  "purple" === colorScheme ||
                  "red" === colorScheme
                ),
              })}
            />
          </div>
          <h1
            className={cn(
              "mb-2 flex items-center justify-center gap-2 text-4xl font-extrabold tracking-tight",
              {
                "text-saltong-green": colorScheme === "green",
                "text-saltong-blue": colorScheme === "blue",
                "text-saltong-purple": colorScheme === "purple",
                "text-saltong-red": colorScheme === "red",
                "text-pink-600 dark:text-pink-400": !(
                  "green" === colorScheme ||
                  "blue" === colorScheme ||
                  "purple" === colorScheme ||
                  "red" === colorScheme
                ),
              }
            )}
          >
            Sorry po!
          </h1>
          <div className="text-muted-foreground mb-8 text-lg">
            To access previous rounds of <b>{name}</b>, please log in or create
            a free account.
            <br />
            <span
              className={cn("font-semibold", {
                "text-saltong-green": colorScheme === "green",
                "text-saltong-blue": colorScheme === "blue",
                "text-saltong-purple": colorScheme === "purple",
                "text-saltong-red": colorScheme === "red",
                "text-pink-600 dark:text-pink-400": !(
                  "green" === colorScheme ||
                  "blue" === colorScheme ||
                  "purple" === colorScheme ||
                  "red" === colorScheme
                ),
              })}
            >
              Sign up for free or log in to continue.
            </span>
          </div>
          <div className="flex w-full flex-col items-center justify-center gap-4 sm:flex-row">
            <Button size="lg" asChild className="w-full sm:w-auto">
              <Link
                href={{
                  pathname: "/auth",
                  query: { next: currPathname },
                }}
              >
                Log in
              </Link>
            </Button>
            <Button
              size="lg"
              variant="secondary"
              asChild
              className="w-full sm:w-auto"
            >
              <Link
                href={{
                  pathname: "/auth",
                  query: { signup: "1", next: currPathname },
                }}
              >
                Sign up
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
