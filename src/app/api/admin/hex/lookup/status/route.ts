import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { isAllowedAdmin } from "../../../utils/is-allowed-admin";

const ADMIN_BUCKET = "admin";
const METADATA_FILE = "hex-lookup-table-meta.json";

interface LookupTableMetadata {
  status: "generating" | "completed" | "error";
  startedAt: string;
  completedAt?: string;
  lastUpdatedAt: string;
  error?: string;
  recordCount?: number;
}

export async function GET() {
  try {
    const supabase = await createClient();

    // Verify user is authenticated
    const { data: authData, error: authError } =
      await supabase.auth.getClaims();

    if (
      authError ||
      !authData?.claims ||
      !isAllowedAdmin(authData.claims.sub)
    ) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const { data, error } = await supabase.storage
      .from(ADMIN_BUCKET)
      .download(METADATA_FILE);

    if (error) {
      return NextResponse.json(
        {
          status: "not_found",
          message: "Lookup table has never been generated",
        },
        { status: 404 }
      );
    }

    const text = await data.text();
    const metadata: LookupTableMetadata = JSON.parse(text);

    // Check if "generating" status is stale (older than 5 minutes)
    if (metadata.status === "generating") {
      const lastUpdated = new Date(metadata.lastUpdatedAt);
      const now = new Date();
      const minutesSinceUpdate =
        (now.getTime() - lastUpdated.getTime()) / 1000 / 60;

      if (minutesSinceUpdate > 5) {
        // Status is stale, treat as error
        return NextResponse.json({
          ...metadata,
          status: "error" as const,
          error: "Generation timed out (no update in over 5 minutes)",
          completedAt: new Date().toISOString(),
        });
      }
    }

    return NextResponse.json(metadata);
  } catch (error) {
    console.error("Error fetching lookup table metadata:", error);

    return NextResponse.json(
      {
        error: "Failed to fetch lookup table metadata",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
