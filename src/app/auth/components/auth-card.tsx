import HoverPrefetchLink from "@/components/shared/hover-prefetch-link";
import { Card, CardTitle, CardContent } from "@/components/ui/card";
import { useSidebar } from "@/components/ui/sidebar";
import Image from "next/image";
import { ReactNode, useEffect } from "react";

interface AuthCardProps {
  children: ReactNode;
  className?: string;
}

export function AuthCard({ children, className = "" }: AuthCardProps) {
  const { setOpen } = useSidebar();

  useEffect(() => {
    setOpen(false);

    return () => {
      setOpen(true);
    };
  }, [setOpen]);

  return (
    <Card
      className={`bg-background mx-4 w-full max-w-xl px-4 py-8 backdrop-blur-xs ${className}`}
    >
      <CardTitle className="flex w-full items-center justify-center gap-1.5">
        <HoverPrefetchLink href="/" className="flex gap-1.5">
          <Image src="/hub.svg" alt="Saltong Hub Logo" width={36} height={36} />
          <h3 className="text-3xl tracking-tighter">
            Saltong<span className="font-light">Hub</span>
          </h3>
        </HoverPrefetchLink>
      </CardTitle>
      <CardContent className="flex flex-col items-center justify-center gap-4">
        {children}
      </CardContent>
    </Card>
  );
}
