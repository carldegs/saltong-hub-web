"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FOOTER_LINKS } from "./footer-links";
import { shouldShowAppFooter } from "./footer-visibility";

export function AppFooter() {
  const pathname = usePathname();

  if (!shouldShowAppFooter(pathname)) {
    return null;
  }

  return (
    <footer className="bg-muted/10 border-t">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-3 px-4 py-6 text-sm sm:flex-row sm:items-center sm:justify-between">
        <p className="font-medium">Saltong Hub</p>
        <nav aria-label="Footer navigation">
          <ul className="text-muted-foreground flex flex-wrap gap-x-4 gap-y-2">
            {FOOTER_LINKS.map((link) => (
              <li key={link.href}>
                <Link className="hover:text-foreground" href={link.href}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </footer>
  );
}
