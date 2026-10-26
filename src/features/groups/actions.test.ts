import { beforeEach, expect, it, vi } from "vitest";
import { updateGroupAction } from "./actions";

const { client, admin, update } = vi.hoisted(() => {
  const membership = {
    select: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    single: vi.fn().mockResolvedValue({ data: { role: "admin" }, error: null }),
  };
  const update = vi.fn();
  const group = {
    update,
    eq: vi.fn().mockReturnThis(),
    select: vi.fn().mockReturnThis(),
    single: vi.fn(),
  };
  update.mockImplementation((data) => {
    group.single.mockResolvedValue({
      data: { id: "group-1", ...data },
      error: null,
    });
    return group;
  });
  return {
    client: {
      auth: {
        getClaims: vi.fn().mockResolvedValue({
          data: { claims: { sub: "user-1" } },
          error: null,
        }),
      },
      from: vi.fn().mockReturnValue(membership),
    },
    admin: { from: vi.fn().mockReturnValue(group) },
    update,
  };
});

vi.mock("@/lib/supabase/server", () => ({ createClient: () => client }));
vi.mock("@/lib/supabase/admin-server", () => ({
  createServiceRoleClient: () => admin,
}));

beforeEach(() => vi.clearAllMocks());

it.each([true, false])(
  "updates invite settings (%s) with a valid non-null invite code",
  async (invitesEnabled) => {
    const result = await updateGroupAction("group-1", { invitesEnabled });
    expect(result.group.invitesEnabled).toBe(invitesEnabled);
    expect(result.group.inviteCode).toMatch(/^[A-HJKMNP-Z2-9]{8}$/);
    expect(update).toHaveBeenCalledWith({
      invitesEnabled,
      inviteCode: result.group.inviteCode,
    });
  }
);

it("leaves invite codes untouched when updating the group name", async () => {
  await updateGroupAction("group-1", { name: "New name" });
  expect(update).toHaveBeenCalledWith({ name: "New name" });
});
