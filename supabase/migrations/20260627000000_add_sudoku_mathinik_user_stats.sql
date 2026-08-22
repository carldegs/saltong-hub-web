create table "sudoku-user-rounds" (
  "userId" uuid not null,
  "date" date not null,
  "mode" text not null,
  "roundId" integer not null,

  "startedAt" timestamptz not null default now(),
  "completedAt" timestamptz null,
  "updatedAt" timestamptz not null default now(),

  "moveCount" integer not null default 0,
  "hintCount" integer not null default 0,
  "mistakeCount" integer not null default 0,

  "cells" text not null default repeat('0000'::text, 81),
  "solvedLive" boolean not null default false,

  primary key ("userId", "date", "mode"),

  constraint "sudoku-user-rounds_mode_check"
    check ("mode" in ('easy', 'medium', 'hard', 'bathala')),

  constraint "sudoku-user-rounds_cells_check"
    check ("cells" ~ '^([0-9][0-9a-f]{3}){81}$'),

  constraint "sudoku-user-rounds_counts_check"
    check (
      "moveCount" >= 0
      and "hintCount" >= 0
      and "mistakeCount" >= 0
    )
);

create index "sudoku-user-rounds_user_date_idx"
  on "sudoku-user-rounds" ("userId", "date" desc);

create index "sudoku-user-rounds_user_mode_date_idx"
  on "sudoku-user-rounds" ("userId", "mode", "date" desc);

create table "mathinik-user-rounds" (
  "userId" uuid not null,
  "date" date not null,
  "roundId" integer not null,

  "startedAt" timestamptz not null default now(),
  "completedAt" timestamptz null,
  "updatedAt" timestamptz not null default now(),

  "solvedLive" boolean not null default false,

  "equations" text null,

  primary key ("userId", "date"),

  constraint "mathinik-user-rounds_equations_check"
    check ("equations" is null or length("equations") <= 10000)
);

create index "mathinik-user-rounds_user_date_idx"
  on "mathinik-user-rounds" ("userId", "date" desc);

create table "user-game-stats" (
  "userId" uuid not null,
  "gameId" text not null,
  "mode" text not null default '',

  "totalStarted" integer not null default 0,
  "totalCompleted" integer not null default 0,

  "currentCompletionStreak" integer not null default 0,
  "longestCompletionStreak" integer not null default 0,

  "lastPlayedDate" date null,
  "lastCompletedDate" date null,
  "lastCompletedRoundId" integer null,

  "bests" jsonb not null default '{}'::jsonb,
  "totals" jsonb not null default '{}'::jsonb,

  "createdAt" timestamptz not null default now(),
  "updatedAt" timestamptz not null default now(),

  primary key ("userId", "gameId", "mode"),

  constraint "user-game-stats_game_check"
    check ("gameId" in ('sudoku', 'mathinik')),

  constraint "user-game-stats_counts_check"
    check (
      "totalStarted" >= 0
      and "totalCompleted" >= 0
      and "totalCompleted" <= "totalStarted"
      and "currentCompletionStreak" >= 0
      and "longestCompletionStreak" >= 0
    )
);

create index "user-game-stats_user_game_idx"
  on "user-game-stats" ("userId", "gameId");
