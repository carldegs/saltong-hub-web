import type {
  AdminPersistedStatsRow,
  AdminUpsertStatsRequest,
} from "@/app/admin/transfer/types";
import type { User } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

import { SALTONG_MODES } from "@/features/saltong/constants";
import { SaltongMode, SaltongUserStats } from "@/features/saltong/types";
import { createServiceRoleClient } from "@/lib/supabase/admin-server";
import { createClient } from "@/lib/supabase/server";

type AdminClient = ReturnType<typeof createServiceRoleClient>;

type IncomingStatsRow = Partial<AdminPersistedStatsRow> & {
  mode?: string;
};

type SanitizedStatsRow = AdminPersistedStatsRow & {
  userId: string;
};

function createEmptyStatsRecord() {
  return {
    classic: null,
    max: null,
    mini: null,
  } as Record<SaltongMode, SaltongUserStats | null>;
}

async function fetchStatsByUserId(adminClient: AdminClient, userId: string) {
  const { data, error } = await adminClient
    .from("saltong-user-stats")
    .select("*")
    .eq("userId", userId);

  if (error) {
    throw new Error(error.message ?? "Failed to load stats");
  }

  const statsByMode = createEmptyStatsRecord();

  data?.forEach((row) => {
    const mode = row.mode as SaltongMode;
    if (SALTONG_MODES.includes(mode)) {
      statsByMode[mode] = row as SaltongUserStats;
    }
  });

  return statsByMode;
}

function sanitizeStatCount(value: unknown) {
  if (typeof value !== "number" || Number.isNaN(value)) {
    return 0;
  }
  return Math.max(0, Math.floor(value));
}

function sanitizeNullableNumber(value: unknown) {
  if (typeof value !== "number" || Number.isNaN(value)) {
    return null;
  }
  return value;
}

function sanitizeWinTurns(value: unknown) {
  if (!Array.isArray(value)) {
    return [] as number[];
  }

  return value.map((turn) => {
    const numericValue = Number(turn);
    if (!Number.isFinite(numericValue)) {
      return 0;
    }
    return Math.max(0, Math.floor(numericValue));
  });
}

function sanitizeStatsRow(
  row: IncomingStatsRow,
  userId: string
): SanitizedStatsRow | null {
  if (!row.mode || !SALTONG_MODES.includes(row.mode as SaltongMode)) {
    return null;
  }

  const mode = row.mode as SaltongMode;

  return {
    userId,
    mode,
    totalWins: sanitizeStatCount(row.totalWins),
    totalLosses: sanitizeStatCount(row.totalLosses),
    currentWinStreak: sanitizeStatCount(row.currentWinStreak),
    longestWinStreak: sanitizeStatCount(row.longestWinStreak),
    lastGameDate:
      typeof row.lastGameDate === "string" ? row.lastGameDate : null,
    lastRoundId: sanitizeNullableNumber(row.lastRoundId),
    winTurns: sanitizeWinTurns(row.winTurns),
  } satisfies SanitizedStatsRow;
}

function isAllowedAdmin(userId: string | undefined | null) {
  if (!userId) return false;

  const allowedAdmins =
    process.env.ADMIN_USER_IDS?.split(",").map((id) => id.trim()) ?? [];

  return allowedAdmins.includes(userId);
}

async function findUserByEmailPaginated(
  adminClient: AdminClient,
  email: string,
  { perPage = 50, maxPages = 200 }: { perPage?: number; maxPages?: number } = {}
): Promise<User | null> {
  const normalizedEmail = email.trim().toLowerCase();
  let page = 1;

  while (page <= maxPages) {
    const { data, error } = await adminClient.auth.admin.listUsers({
      page,
      perPage,
    });

    if (error) {
      throw error;
    }

    const users = data?.users ?? [];
    const match = users.find(
      (user) => user.email?.toLowerCase() === normalizedEmail
    );

    if (match) {
      return match;
    }

    if (users.length < perPage) {
      break;
    }

    page += 1;
  }

  return null;
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user: requester },
      error: requesterError,
    } = await supabase.auth.getUser();

    if (requesterError || !requester) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!isAllowedAdmin(requester.id)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = (await request.json().catch(() => ({}))) as {
      email?: string;
    };

    const email = body.email?.trim().toLowerCase();
    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const adminClient = createServiceRoleClient();

    const targetUser = await findUserByEmailPaginated(adminClient, email);
    if (!targetUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const statsByMode = await fetchStatsByUserId(adminClient, targetUser.id);

    return NextResponse.json({
      user: {
        id: targetUser.id,
        email: targetUser.email ?? email,
        createdAt: targetUser.created_at ?? null,
      },
      stats: statsByMode,
    });
  } catch (error) {
    console.error("Failed to fetch admin transfer stats", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Unexpected server error",
      },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user: requester },
      error: requesterError,
    } = await supabase.auth.getUser();

    if (requesterError || !requester) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!isAllowedAdmin(requester.id)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = (await request
      .json()
      .catch(() => ({}))) as Partial<AdminUpsertStatsRequest> & {
      rows?: IncomingStatsRow[];
    };

    const userId = body.userId?.trim();
    if (!userId) {
      return NextResponse.json(
        { error: "userId is required" },
        { status: 400 }
      );
    }

    const rowsInput = Array.isArray(body.rows) ? body.rows : [];
    const sanitizedRows = rowsInput
      .map((row) => sanitizeStatsRow(row, userId))
      .filter((row): row is SanitizedStatsRow => Boolean(row));

    if (sanitizedRows.length === 0) {
      return NextResponse.json(
        { error: "Provide at least one stats row to upsert" },
        { status: 400 }
      );
    }

    const adminClient = createServiceRoleClient();
    const { data: targetUserResult, error: targetUserError } =
      await adminClient.auth.admin.getUserById(userId);

    if (targetUserError || !targetUserResult?.user) {
      return NextResponse.json(
        { error: "Target user not found" },
        { status: 404 }
      );
    }

    const { error: upsertError } = await adminClient
      .from("saltong-user-stats")
      .upsert(sanitizedRows, { onConflict: "userId,mode" });

    if (upsertError) {
      return NextResponse.json(
        { error: upsertError.message ?? "Failed to save stats" },
        { status: 500 }
      );
    }

    const statsByMode = await fetchStatsByUserId(adminClient, userId);
    const targetUser = targetUserResult.user;

    return NextResponse.json({
      user: {
        id: targetUser.id,
        email: targetUser.email ?? "",
        createdAt: targetUser.created_at ?? null,
      },
      stats: statsByMode,
    });
  } catch (error) {
    console.error("Failed to upsert admin transfer stats", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Unexpected server error",
      },
      { status: 500 }
    );
  }
}
