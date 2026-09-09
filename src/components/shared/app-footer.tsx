"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FOOTER_LINK_GROUPS } from "./footer-links";
import { shouldShowAppFooter } from "./footer-visibility";

export function AppFooter() {
  const pathname = usePathname();

  if (!shouldShowAppFooter(pathname)) {
    return null;
  }

  return (
    <footer className="bg-muted/10 border-t">
      <div className="mx-auto grid w-full max-w-5xl gap-8 px-4 py-8 text-sm sm:px-6 lg:grid-cols-[auto_1fr] lg:items-start">
        <Link
          href="/"
          aria-label="Saltong Hub home"
          className="focus-visible:ring-ring w-fit rounded-md focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
        >
          <Image src="/hub.svg" alt="Saltong Hub" width={48} height={48} />
        </Link>
        <nav aria-label="Footer navigation">
          <div className="grid grid-cols-2 gap-x-8 gap-y-7 sm:grid-cols-4">
            {FOOTER_LINK_GROUPS.map((group) => (
              <section
                key={group.label}
                aria-labelledby={`footer-${group.label}`}
              >
                <h2
                  id={`footer-${group.label}`}
                  className="text-foreground text-xs font-semibold tracking-widest uppercase"
                >
                  {group.label}
                </h2>
                <ul className="text-muted-foreground mt-3 space-y-2">
                  {group.links.map((link) => (
                    <li key={link.href}>
                      <Link className="hover:text-foreground" href={link.href}>
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        </nav>
      </div>
    </footer>
  );
}
