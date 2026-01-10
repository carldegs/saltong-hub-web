"use client";

import { useMemo, useRef, useState } from "react";

import {
  differenceInCalendarDays,
  format as formatDateFns,
  parseISO,
} from "date-fns";
import { toast } from "sonner";
import { useDebounceCallback } from "usehooks-ts";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { SALTONG_MODES } from "@/features/saltong/constants";
import { SaltongMode, SaltongUserStats } from "@/features/saltong/types";
import { cn } from "@/lib/utils";

import { useAdminUserStats } from "../hooks/use-admin-user-stats";
import { useAdminUpsertUserStats } from "../hooks/use-admin-upsert-user-stats";
import {
  AdminPersistedStatsRow,
  LegacyModeStatsSnapshot,
  LegacySavePayload,
} from "../types";
import { parseLegacySave } from "../utils/parse-legacy-save";

const numberFormatter = new Intl.NumberFormat("en-US");

const EMPTY_DB_STATS: Record<SaltongMode, SaltongUserStats | null> = {
  classic: null,
  max: null,
  mini: null,
};

const EMPTY_LEGACY_STATS: Record<SaltongMode, LegacyModeStatsSnapshot | null> =
  {
    classic: null,
    max: null,
    mini: null,
  };

type NormalizedStats = {
  exists: boolean;
  gamesPlayed: number;
  totalWins: number;
  totalLosses: number;
  currentWinStreak: number;
  longestWinStreak: number;
  lastGameDate: string | null;
  lastRoundId: number | null;
  winTurns: number[];
};

type OperationInfo = {
  label: string;
  description: string;
  badgeVariant: "default" | "secondary" | "outline";
  kind: "insert" | "update" | "noop" | "empty";
};

type StatKey =
  | "gamesPlayed"
  | "totalWins"
  | "totalLosses"
  | "currentWinStreak"
  | "longestWinStreak"
  | "lastGameDate"
  | "lastRoundId"
  | "winTurns";

type LegacyInputMode = "file" | "text";

const STAT_FIELDS: Array<{
  key: StatKey;
  label: string;
  formatter: (value: NormalizedStats[StatKey]) => string;
}> = [
  {
    key: "gamesPlayed",
    label: "Games played",
    formatter: (value) => formatNumber(value as number),
  },
  {
    key: "totalWins",
    label: "Wins",
    formatter: (value) => formatNumber(value as number),
  },
  {
    key: "totalLosses",
    label: "Losses",
    formatter: (value) => formatNumber(value as number),
  },
  {
    key: "currentWinStreak",
    label: "Current streak",
    formatter: (value) => formatNumber(value as number),
  },
  {
    key: "longestWinStreak",
    label: "Best streak",
    formatter: (value) => formatNumber(value as number),
  },
  {
    key: "lastGameDate",
    label: "Last game date",
    formatter: (value) => formatDate(value as string | null),
  },
  {
    key: "lastRoundId",
    label: "Last round ID",
    formatter: (value) => formatRoundId(value as number | null),
  },
  {
    key: "winTurns",
    label: "Win turns",
    formatter: (value) => formatWinTurns(value as number[]),
  },
];

function formatNumber(value?: number | null) {
  if (typeof value !== "number" || Number.isNaN(value)) {
    return "0";
  }
  return numberFormatter.format(value);
}

function formatDate(value?: string | null) {
  const date = parseDate(value ?? null);
  if (!date) return "--";
  return formatDateFns(date, "MMM d, yyyy");
}

function formatRoundId(value: number | null) {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value.toString();
  }
  return "--";
}

function formatWinTurns(value: number[]) {
  if (!value || value.length === 0) {
    return "None";
  }
  return value.join(", ");
}

function initialStats(overrides?: Partial<NormalizedStats>): NormalizedStats {
  const base: NormalizedStats = {
    exists: false,
    gamesPlayed: 0,
    totalWins: 0,
    totalLosses: 0,
    currentWinStreak: 0,
    longestWinStreak: 0,
    lastGameDate: null,
    lastRoundId: null,
    winTurns: [],
  };

  const merged: NormalizedStats = { ...base, ...overrides };
  merged.winTurns = Array.isArray(overrides?.winTurns)
    ? [...(overrides!.winTurns as number[])]
    : [];

  return merged;
}

function cloneStats(stats: NormalizedStats): NormalizedStats {
  if (!stats.exists) {
    return initialStats();
  }

  return initialStats({
    ...stats,
    winTurns: stats.winTurns,
  });
}

function normalizeDbStats(
  row: SaltongUserStats | null | undefined
): NormalizedStats {
  if (!row) return initialStats();

  const rawTurns = Array.isArray(row.winTurns)
    ? (row.winTurns as Array<number | string>)
    : [];
  const winTurns = rawTurns
    .map((turn) => Number(turn))
    .filter((turn) => Number.isFinite(turn));

  return initialStats({
    exists: true,
    gamesPlayed: (row.totalWins ?? 0) + (row.totalLosses ?? 0),
    totalWins: row.totalWins ?? 0,
    totalLosses: row.totalLosses ?? 0,
    currentWinStreak: row.currentWinStreak ?? 0,
    longestWinStreak: row.longestWinStreak ?? 0,
    lastGameDate: row.lastGameDate ?? null,
    lastRoundId: row.lastRoundId ?? null,
    winTurns,
  });
}

function normalizeLegacyStats(
  snapshot: LegacyModeStatsSnapshot | null | undefined
): NormalizedStats {
  if (!snapshot) return initialStats();

  const totalLosses = Math.max(snapshot.gamesPlayed - snapshot.totalWins, 0);

  return initialStats({
    exists: true,
    gamesPlayed: snapshot.gamesPlayed,
    totalWins: snapshot.totalWins,
    totalLosses,
    currentWinStreak: snapshot.currentWinStreak,
    longestWinStreak: snapshot.longestWinStreak,
    lastGameDate: snapshot.lastWinDate,
    lastRoundId: null,
    winTurns: snapshot.winTurns,
  });
}

function parseDate(value: string | null) {
  if (!value) return null;
  try {
    const parsed = parseISO(value);
    if (Number.isNaN(parsed.getTime())) {
      const fallback = new Date(value);
      return Number.isNaN(fallback.getTime()) ? null : fallback;
    }
    return parsed;
  } catch (e) {
    console.error("Error parsing date:", e);
    const fallback = new Date(value);
    return Number.isNaN(fallback.getTime()) ? null : fallback;
  }
}

function toTimestamp(value: string | null) {
  const parsed = parseDate(value);
  if (!parsed) return null;
  const ts = parsed.getTime();
  return Number.isFinite(ts) ? ts : null;
}

function isContinuous(previous: string | null, next: string | null) {
  const prevDate = parseDate(previous);
  const nextDate = parseDate(next);

  if (!prevDate || !nextDate) return false;

  const diff = differenceInCalendarDays(nextDate, prevDate);
  return diff >= 0 && diff <= 1;
}

function pickLatestDate(
  current: string | null,
  incoming: string | null
): string | null {
  const currentTs = toTimestamp(current);
  const incomingTs = toTimestamp(incoming);

  if (currentTs === null && incomingTs === null) return null;
  if (currentTs === null) return incoming;
  if (incomingTs === null) return current;

  return incomingTs >= currentTs ? incoming : current;
}

function pickLatestNumber(
  current: number | null,
  incoming: number | null
): number | null {
  const values = [current, incoming].filter(
    (value): value is number =>
      typeof value === "number" && Number.isFinite(value)
  );
  if (values.length === 0) return null;
  return Math.max(...values);
}

function mergeWinTurns(current: number[], incoming: number[]) {
  const maxLength = Math.max(current.length, incoming.length);
  if (maxLength === 0) return [];

  const merged: number[] = Array.from({ length: maxLength }, (_, index) => {
    const currentValue = Number.isFinite(current[index]) ? current[index] : 0;
    const incomingValue = Number.isFinite(incoming[index])
      ? incoming[index]
      : 0;
    return currentValue + incomingValue;
  });

  return merged;
}

function mergeCurrentStreak(
  current: NormalizedStats,
  incoming: NormalizedStats,
  resultingLastGameDate: string | null
) {
  if (!current.exists && !incoming.exists) {
    return 0;
  }

  if (!current.exists) {
    return incoming.currentWinStreak;
  }

  if (!incoming.exists) {
    return current.currentWinStreak;
  }

  const currentDate = current.lastGameDate;
  const incomingDate = incoming.lastGameDate;

  if (!currentDate && !incomingDate) {
    return Math.max(current.currentWinStreak, incoming.currentWinStreak);
  }

  if (
    resultingLastGameDate &&
    currentDate &&
    resultingLastGameDate === currentDate
  ) {
    if (isContinuous(incomingDate, currentDate)) {
      return incoming.currentWinStreak + current.currentWinStreak;
    }
    return current.currentWinStreak;
  }

  if (
    resultingLastGameDate &&
    incomingDate &&
    resultingLastGameDate === incomingDate
  ) {
    if (isContinuous(currentDate, incomingDate)) {
      return current.currentWinStreak + incoming.currentWinStreak;
    }
    return incoming.currentWinStreak;
  }

  if (!resultingLastGameDate) {
    return Math.max(current.currentWinStreak, incoming.currentWinStreak);
  }

  return Math.max(current.currentWinStreak, incoming.currentWinStreak);
}

function mergeStats(
  current: NormalizedStats,
  incoming: NormalizedStats
): NormalizedStats {
  if (!current.exists && !incoming.exists) {
    return initialStats();
  }

  if (!incoming.exists) {
    return cloneStats(current);
  }

  if (!current.exists) {
    return cloneStats(incoming);
  }

  const lastGameDate = pickLatestDate(
    current.lastGameDate,
    incoming.lastGameDate
  );
  const mergedCurrentStreak = mergeCurrentStreak(
    current,
    incoming,
    lastGameDate
  );
  const mergedLongestStreak = Math.max(
    current.longestWinStreak,
    incoming.longestWinStreak,
    mergedCurrentStreak
  );

  return initialStats({
    exists: true,
    gamesPlayed: current.gamesPlayed + incoming.gamesPlayed,
    totalWins: current.totalWins + incoming.totalWins,
    totalLosses: current.totalLosses + incoming.totalLosses,
    currentWinStreak: mergedCurrentStreak,
    longestWinStreak: mergedLongestStreak,
    lastGameDate,
    lastRoundId: pickLatestNumber(current.lastRoundId, incoming.lastRoundId),
    winTurns: mergeWinTurns(current.winTurns, incoming.winTurns),
  });
}

function determineOperation(
  currentExists: boolean,
  incomingExists: boolean
): OperationInfo {
  if (incomingExists && currentExists) {
    return {
      label: "Update",
      description: "Existing row will be updated with the merged totals.",
      badgeVariant: "secondary",
      kind: "update",
    };
  }
  if (incomingExists && !currentExists) {
    return {
      label: "Insert",
      description: "A brand-new row will be created for this mode.",
      badgeVariant: "default",
      kind: "insert",
    };
  }
  if (!incomingExists && currentExists) {
    return {
      label: "No change",
      description: "No legacy data loaded for this mode.",
      badgeVariant: "outline",
      kind: "noop",
    };
  }
  return {
    label: "No data",
    description: "No Supabase row or legacy data available.",
    badgeVariant: "outline",
    kind: "empty",
  };
}

interface StatsColumnProps {
  title: string;
  subtitle?: string;
  stats: NormalizedStats;
  emptyLabel?: string;
  highlight?: boolean;
}

function StatsColumn({
  title,
  subtitle,
  stats,
  emptyLabel,
  highlight = false,
}: StatsColumnProps) {
  return (
    <div
      className={cn(
        "space-y-3 rounded-lg border p-4",
        highlight && "border-primary/40 bg-primary/5 shadow-sm"
      )}
    >
      <div>
        <p className="text-sm font-semibold">{title}</p>
        {subtitle && (
          <p className="text-muted-foreground text-xs">{subtitle}</p>
        )}
      </div>
      {stats.exists ? (
        <dl className="space-y-2 text-sm">
          {STAT_FIELDS.map((field) => (
            <div
              key={field.key}
              className="flex items-center justify-between gap-2"
            >
              <dt className="text-muted-foreground">{field.label}</dt>
              <dd className="font-medium">
                {field.formatter(stats[field.key])}
              </dd>
            </div>
          ))}
        </dl>
      ) : (
        <p className="text-muted-foreground text-sm">
          {emptyLabel ?? "No data available."}
        </p>
      )}
    </div>
  );
}

interface ModeComparisonRow {
  mode: SaltongMode;
  current: NormalizedStats;
  toMigrate: NormalizedStats;
  resulting: NormalizedStats;
  operation: OperationInfo;
}

function StatsComparisonTable({ rows }: { rows: ModeComparisonRow[] }) {
  return (
    <div className="space-y-6">
      {rows.map(({ mode, current, toMigrate, resulting, operation }) => (
        <div key={mode} className="space-y-4 rounded-xl border p-4">
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-lg font-semibold capitalize">{mode}</p>
              <p className="text-muted-foreground text-sm">
                {operation.description}
              </p>
            </div>
            <Badge variant={operation.badgeVariant}>{operation.label}</Badge>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            <StatsColumn
              title="Current DB data"
              stats={current}
              emptyLabel="No row exists in Supabase yet."
            />
            <StatsColumn
              title="Data to migrate"
              stats={toMigrate}
              emptyLabel="Upload a legacy save file to populate."
            />
            <StatsColumn
              title="New DB data (preview)"
              stats={resulting}
              highlight
              emptyLabel="No data to preview yet."
            />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function ImportLegacyStatsCard() {
  const [emailInput, setEmailInput] = useState("");
  const [lookupEmail, setLookupEmail] = useState("");
  const [parsedPayload, setParsedPayload] = useState<LegacySavePayload | null>(
    null
  );
  const [legacyInputError, setLegacyInputError] = useState<string | null>(null);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const [legacyInputMode, setLegacyInputMode] =
    useState<LegacyInputMode>("file");
  const [manualTextInput, setManualTextInput] = useState("");
  const [parsedSource, setParsedSource] = useState<LegacyInputMode | null>(
    null
  );
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const updateLookupEmail = useDebounceCallback((value: string) => {
    setLookupEmail(value);
  }, 400);

  const {
    data: supabaseData,
    error: supabaseError,
    isFetching,
    refetch,
  } = useAdminUserStats(lookupEmail);
  const upsertStatsMutation = useAdminUpsertUserStats();

  const normalizedInputEmail = emailInput.trim().toLowerCase();
  const canLookup = normalizedInputEmail.length > 3;
  const isManualTextReady = manualTextInput.trim().length > 0;

  const statsFromDb = supabaseData?.stats ?? EMPTY_DB_STATS;
  const legacyStats = parsedPayload?.modes ?? EMPTY_LEGACY_STATS;

  const comparisonRows: ModeComparisonRow[] = SALTONG_MODES.map((mode) => {
    const current = normalizeDbStats(statsFromDb[mode]);
    const toMigrate = normalizeLegacyStats(legacyStats[mode]);
    const resulting = mergeStats(current, toMigrate);

    return {
      mode,
      current,
      toMigrate,
      resulting,
      operation: determineOperation(current.exists, toMigrate.exists),
    };
  });

  const rowsToPersist: AdminPersistedStatsRow[] = comparisonRows
    .filter(
      ({ operation }) =>
        operation.kind === "insert" || operation.kind === "update"
    )
    .map(({ mode, resulting }) => ({
      mode,
      totalWins: resulting.totalWins,
      totalLosses: resulting.totalLosses,
      currentWinStreak: resulting.currentWinStreak,
      longestWinStreak: resulting.longestWinStreak,
      lastGameDate: resulting.lastGameDate,
      lastRoundId: resulting.lastRoundId,
      winTurns: [...resulting.winTurns],
    }));

  const canPersistStats = Boolean(
    supabaseData?.user.id && parsedPayload && rowsToPersist.length > 0
  );

  const hasAnySourceData = comparisonRows.some(
    ({ current, toMigrate }) => current.exists || toMigrate.exists
  );

  const parsedJson = useMemo(() => {
    if (!parsedPayload) return "";
    return JSON.stringify(parsedPayload.modes, null, 2);
  }, [parsedPayload]);

  const handleLegacyInputModeChange = (mode: LegacyInputMode) => {
    setLegacyInputMode(mode);
    setLegacyInputError(null);
    if (mode === "text") {
      setSelectedFileName(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleManualTextLoad = () => {
    const trimmedPayload = manualTextInput.trim();
    if (!trimmedPayload) {
      setParsedPayload(null);
      setLegacyInputError("Paste a legacy save string before loading.");
      setParsedSource(null);
      return;
    }

    try {
      const parsed = parseLegacySave(trimmedPayload);
      setParsedPayload(parsed);
      setLegacyInputError(null);
      setSelectedFileName(null);
      setParsedSource("text");
    } catch (error) {
      setParsedPayload(null);
      setLegacyInputError(
        error instanceof Error ? error.message : "Failed to parse save text"
      );
      setParsedSource(null);
    }
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.currentTarget.files?.[0];
    if (!file) {
      setParsedPayload(null);
      setLegacyInputError(null);
      setSelectedFileName(null);
      setParsedSource(null);
      return;
    }

    try {
      const rawText = await file.text();
      const parsed = parseLegacySave(rawText);
      setParsedPayload(parsed);
      setLegacyInputError(null);
      setParsedSource("file");
      setManualTextInput("");
    } catch (error) {
      setParsedPayload(null);
      setLegacyInputError(
        error instanceof Error ? error.message : "Failed to parse save file"
      );
      setParsedSource(null);
    }

    setSelectedFileName(file.name);
  };

  const clearFileSelection = () => {
    setParsedPayload(null);
    setLegacyInputError(null);
    setSelectedFileName(null);
    setParsedSource(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleManualRefresh = () => {
    if (canLookup) {
      setLookupEmail(emailInput);
      refetch();
    }
  };

  const handlePersistStats = () => {
    if (!supabaseData || rowsToPersist.length === 0) {
      toast.error("Load a user and a legacy save before saving stats.");
      return;
    }

    upsertStatsMutation.mutate(
      {
        userId: supabaseData.user.id,
        rows: rowsToPersist,
      },
      {
        onSuccess: () => {
          toast.success("Saltong stats saved to Supabase.");
          refetch();
        },
        onError: (error) => {
          toast.error(error.message);
        },
      }
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Import Legacy Stats</CardTitle>
        <CardDescription>
          Provide a user email and an exported save file. We will preview the
          current Supabase values, the incoming legacy stats, and the merged row
          that would be persisted.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        <section className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="legacyEmail">User email</Label>
            <div className="flex flex-col gap-2 sm:flex-row">
              <Input
                id="legacyEmail"
                type="email"
                placeholder="user@example.com"
                value={emailInput}
                onChange={(event) => {
                  const nextValue = event.currentTarget.value;
                  setEmailInput(nextValue);
                  updateLookupEmail(nextValue);
                }}
                autoComplete="off"
              />
              <Button
                type="button"
                variant="secondary"
                onClick={handleManualRefresh}
                disabled={!canLookup || isFetching}
                className="sm:w-40"
              >
                {isFetching ? "Loading..." : "Refresh"}
              </Button>
            </div>
            <p className="text-muted-foreground text-xs">
              We look up the Supabase auth profile and stats using the service
              role key. Preview updates automatically when both the lookup and
              file parsing succeed.
            </p>
          </div>

          {supabaseError && (
            <p className="text-destructive text-sm font-medium">
              {supabaseError.message}
            </p>
          )}

          {supabaseData && (
            <div className="bg-muted/40 rounded-lg border p-4 text-sm">
              <p>
                <span className="text-muted-foreground">User ID:</span>{" "}
                {supabaseData.user.id}
              </p>
              <p>
                <span className="text-muted-foreground">Created:</span>{" "}
                {formatDate(supabaseData.user.createdAt)}
              </p>
              <p>
                <span className="text-muted-foreground">Email:</span>{" "}
                {supabaseData.user.email}
              </p>
            </div>
          )}

          {!supabaseData && !supabaseError && (
            <p className="text-muted-foreground text-sm">
              Enter an email and refresh to load their Supabase row.
            </p>
          )}
        </section>

        <Separator />

        <section className="space-y-4">
          <div className="space-y-3">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="space-y-1">
                <Label>Legacy save data</Label>
                <p className="text-muted-foreground text-xs">
                  Upload the .txt export or paste the encoded string from the
                  legacy Transfer Data modal. Parsing stays in the browser.
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant={legacyInputMode === "file" ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleLegacyInputModeChange("file")}
                  aria-pressed={legacyInputMode === "file"}
                >
                  Upload file
                </Button>
                <Button
                  type="button"
                  variant={legacyInputMode === "text" ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleLegacyInputModeChange("text")}
                  aria-pressed={legacyInputMode === "text"}
                >
                  Paste text
                </Button>
              </div>
            </div>

            {legacyInputMode === "file" ? (
              <div className="space-y-2">
                <Input
                  ref={fileInputRef}
                  id="legacyFile"
                  type="file"
                  onChange={handleFileChange}
                />
                <p className="text-muted-foreground text-xs">
                  Select the export named like <em>saltong-save.txt</em>.
                </p>
                <div className="text-muted-foreground flex items-center justify-between text-sm">
                  <span>
                    {selectedFileName
                      ? `Loaded: ${selectedFileName}`
                      : parsedSource === "file"
                        ? "Parsed file in memory"
                        : "No file selected"}
                  </span>
                  {selectedFileName && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={clearFileSelection}
                    >
                      Clear file
                    </Button>
                  )}
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <Label htmlFor="legacyText">Legacy save text</Label>
                <Textarea
                  id="legacyText"
                  value={manualTextInput}
                  onChange={(event) =>
                    setManualTextInput(event.currentTarget.value)
                  }
                  placeholder="Paste the exported legacy save text here"
                  spellCheck={false}
                  autoComplete="off"
                  className="h-40"
                />
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-muted-foreground text-sm">
                    {parsedSource === "text"
                      ? "Current payload loaded from text input."
                      : "Paste the encoded string and load to preview."}
                  </p>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={handleManualTextLoad}
                    disabled={!isManualTextReady}
                  >
                    Load text
                  </Button>
                </div>
              </div>
            )}

            {legacyInputError && (
              <p className="text-destructive text-sm font-medium">
                {legacyInputError}
              </p>
            )}
          </div>

          {parsedPayload && (
            <div className="space-y-2">
              <Label>Decoded payload (JSON)</Label>
              <ScrollArea className="bg-muted/40 h-72 max-h-72 rounded-md border p-4">
                <pre className="h-full text-xs leading-relaxed">
                  {parsedJson}
                </pre>
              </ScrollArea>
            </div>
          )}
        </section>

        <Separator />

        <section className="space-y-4">
          <div>
            <p className="text-base font-medium">Migration preview</p>
            <p className="text-muted-foreground text-sm">
              We add legacy totals to the current row (games, wins, losses,
              streaks), merge win turns, and keep the most recent
              lastGameDate/lastRoundId. Use this as your source of truth before
              triggering any Supabase mutations.
            </p>
          </div>

          {hasAnySourceData ? (
            <StatsComparisonTable rows={comparisonRows} />
          ) : (
            <p className="text-muted-foreground text-sm">
              Lookup a user and/or upload a save file to populate the preview.
            </p>
          )}
        </section>

        <Separator />

        <section className="space-y-3">
          <div>
            <p className="text-base font-medium">Apply merged stats</p>
            <p className="text-muted-foreground text-sm">
              We only persist modes marked Insert or Update. Double-check the
              preview before saving to Supabase.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-muted-foreground text-sm">
              {rowsToPersist.length === 0
                ? "Load a legacy save with stats to enable this action."
                : `Ready to persist ${rowsToPersist.length} mode${
                    rowsToPersist.length > 1 ? "s" : ""
                  }.`}
            </p>
            <Button
              type="button"
              onClick={handlePersistStats}
              disabled={!canPersistStats || upsertStatsMutation.isPending}
            >
              {upsertStatsMutation.isPending
                ? "Saving stats..."
                : "Save stats to Supabase"}
            </Button>
          </div>
          {upsertStatsMutation.error && (
            <p className="text-destructive text-sm font-medium">
              {upsertStatsMutation.error.message}
            </p>
          )}
        </section>
      </CardContent>
    </Card>
  );
}
