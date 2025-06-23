import { ChevronRightIcon } from "lucide-react";
import React, { HTMLAttributes, AnchorHTMLAttributes } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export function SettingsSectionHeader({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <h3 className="text-accent-foreground/80 bg-accent px-6 py-2 text-sm font-bold tracking-widest uppercase">
      {children}
    </h3>
  );
}

// Link item: always shows chevron, wraps with Next.js Link
export function SettingsSectionItemLink({
  href,
  children,
  className = "",
  ...props
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
} & Omit<
  AnchorHTMLAttributes<HTMLAnchorElement>,
  "href" | "className" | "children"
>) {
  return (
    <div>
      <Link href={href} className="contents" {...props}>
        <div
          className={cn(
            "hover:bg-muted/50 group flex cursor-pointer items-center justify-between gap-2 px-6 py-3 transition",
            className
          )}
        >
          <span>{children}</span>
          <div className="min-h-8" />
          <span className="text-muted-foreground group-hover:text-primary transition-colors">
            <ChevronRightIcon size={16} />
          </span>
        </div>
      </Link>
    </div>
  );
}

// Basic item: no chevron, can have a right-side element
export function SettingsSectionItem({
  children,
  className = "",
  ...props
}: {
  children: React.ReactNode;
  className?: string;
} & HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "hover:bg-muted/50 group flex min-h-14 items-center justify-between gap-2 px-6 py-3 transition",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function SettingsSectionList({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`divide-border divide-y overflow-hidden ${className}`}>
      {children}
    </div>
  );
}

export function SettingsSectionContent({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={`px-0 pt-0 ${className}`}>{children}</div>;
}
