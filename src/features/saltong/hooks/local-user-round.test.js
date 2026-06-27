import assert from "node:assert/strict";
import test from "node:test";

import {
  findLocalSaltongUserRound,
  upsertLocalSaltongUserRound,
} from "./local-user-round.ts";

function makeRound(overrides) {
  return {
    answer: "SALIT",
    date: "2026-06-25",
    endedAt: null,
    grid: null,
    isCorrect: null,
    mode: "classic",
    solvedLive: null,
    solvedTurn: null,
    startedAt: "2026-06-25T00:00:00.000Z",
    updatedAt: "2026-06-25T00:00:00.000Z",
    userId: "unauthenticated",
    ...overrides,
  };
}

test("findLocalSaltongUserRound matches user, mode, and date", () => {
  const rounds = [
    makeRound({ answer: "FIRST", date: "2026-06-25" }),
    makeRound({ answer: "SECOND", date: "2026-06-26" }),
  ];

  assert.equal(
    findLocalSaltongUserRound(rounds, {
      userId: "unauthenticated",
      mode: "classic",
      date: "2026-06-26",
    })?.answer,
    "SECOND"
  );
});

test("upsertLocalSaltongUserRound keeps dates and modes separate", () => {
  const now = "2026-06-26T01:00:00.000Z";
  const firstClassic = makeRound({ answer: "FIRST", date: "2026-06-25" });
  const secondClassic = makeRound({ answer: "SECOND", date: "2026-06-26" });
  const miniSameDate = makeRound({
    answer: "MINI",
    date: "2026-06-26",
    mode: "mini",
  });

  const rounds = [firstClassic, miniSameDate];
  const withSecondDate = upsertLocalSaltongUserRound(
    rounds,
    secondClassic,
    now
  );

  assert.equal(withSecondDate.length, 3);
  assert.deepEqual(
    withSecondDate.map(({ answer, date, mode }) => ({ answer, date, mode })),
    [
      { answer: "FIRST", date: "2026-06-25", mode: "classic" },
      { answer: "MINI", date: "2026-06-26", mode: "mini" },
      { answer: "SECOND", date: "2026-06-26", mode: "classic" },
    ]
  );

  const updatedSameDate = upsertLocalSaltongUserRound(
    withSecondDate,
    makeRound({
      answer: "UPDATED",
      date: "2026-06-26",
      mode: "classic",
      solvedTurn: 3,
    }),
    now
  );

  assert.equal(updatedSameDate.length, 3);
  assert.equal(
    findLocalSaltongUserRound(updatedSameDate, {
      userId: "unauthenticated",
      mode: "classic",
      date: "2026-06-25",
    })?.answer,
    "FIRST"
  );
  assert.equal(
    findLocalSaltongUserRound(updatedSameDate, {
      userId: "unauthenticated",
      mode: "classic",
      date: "2026-06-26",
    })?.answer,
    "UPDATED"
  );
  assert.equal(
    findLocalSaltongUserRound(updatedSameDate, {
      userId: "unauthenticated",
      mode: "mini",
      date: "2026-06-26",
    })?.answer,
    "MINI"
  );
});
