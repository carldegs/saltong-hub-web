// WARNING: CODE BELOW IS AI SLOP. PLEASE REVIEW CAREFULLY BEFORE USING.
import type { Metadata } from "next";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

import ImportLegacyStatsCard from "./components/import-legacy-stats-card";

export const metadata: Metadata = {
  title: "Transfer Legacy Data | Saltong Admin",
  description:
    "Utilities for syncing a user\'s current round and historical stats.",
};

export default function AdminTransferPage() {
  return (
    <div className="container mx-auto max-w-5xl space-y-8 p-6">
      <header className="space-y-3">
        <Badge variant="outline" className="text-xs tracking-widest uppercase">
          Internal tooling
        </Badge>
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">
            Transfer legacy data
          </h1>
          <p className="text-muted-foreground mt-2 text-base">
            Use these tools to manually sync corrupted accounts before we roll
            out the automated migration script.
          </p>
        </div>
      </header>

      <Alert>
        <AlertTitle>Heads up!</AlertTitle>
        <AlertDescription>
          Nothing is wired to Supabase yet. We&apos;re scaffolding the UI first
          so we can agree on the fields and workflow before touching production
          data.
        </AlertDescription>
      </Alert>

      <Separator />

      <section className="space-y-6">
        <ImportLegacyStatsCard />
      </section>
    </div>
  );
}
