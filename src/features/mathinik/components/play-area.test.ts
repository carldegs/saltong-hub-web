import { describe, expect, it } from "vitest";

import {
  canDeleteMathinikEquation,
  removeMathinikEquationRows,
} from "./play-area";

describe("canDeleteMathinikEquation", () => {
  it("disables deletion for the only empty equation", () => {
    expect(
      canDeleteMathinikEquation("empty", [
        {
          id: "completed",
          first: { value: 3, sourceId: "deck-0" },
          operator: "+",
          second: { value: 4, sourceId: "deck-1" },
        },
        { id: "empty" },
      ])
    ).toBe(false);
  });
});

describe("removeMathinikEquationRows", () => {
  it("keeps an empty equation after deleting the only empty equation", () => {
    const remainingRows = removeMathinikEquationRows(new Set(["empty"]), [
      {
        id: "completed",
        first: { value: 3, sourceId: "deck-0" },
        operator: "+",
        second: { value: 4, sourceId: "deck-1" },
      },
      { id: "empty" },
    ]);

    expect(remainingRows).toHaveLength(2);
    expect(remainingRows[0]).toMatchObject({ id: "completed" });
    expect(remainingRows[1]).toEqual({ id: expect.any(String) });
  });
});
