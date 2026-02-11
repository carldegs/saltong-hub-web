import { Button } from "@/components/ui/button";
import { VaultIcon } from "lucide-react";
import Link from "next/link";
import { SaltongMode } from "../../types";

export default function VaultButton({ mode }: { mode: SaltongMode }) {
  return (
    <Button variant="outline" size="respIcon" asChild>
      <Link
        href={`/play${mode === "classic" ? "" : `/${mode}`}/vault`}
        prefetch={false}
      >
        <VaultIcon />
        <span className="hidden md:block">Vault</span>
      </Link>
    </Button>
  );
}
