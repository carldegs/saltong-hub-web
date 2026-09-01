import { describe, expect, it } from "vitest";
import { buildGroupUpdateData } from "./build-group-update";

describe("buildGroupUpdateData", () => {
  it("invalidates the existing invite code when invites are disabled", () => {
    const update = buildGroupUpdateData({ invitesEnabled: false });

    expect(update.invitesEnabled).toBe(false);
    expect(update.inviteCode).toMatch(/^[A-Z2-9]{8}$/);
  });
});
