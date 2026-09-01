import { describe, expect, it } from "vitest";
import { buildGroupUpdateData } from "./build-group-update";

describe("buildGroupUpdateData", () => {
  it("rotates the invite code when invites are disabled", () => {
    const update = buildGroupUpdateData({ invitesEnabled: false });

    expect(update.invitesEnabled).toBe(false);
    expect(update.inviteCode).toMatch(/^[A-Z2-9]{8}$/);
  });
});
