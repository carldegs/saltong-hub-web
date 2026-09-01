import { renderToStaticMarkup } from "react-dom/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

const getClaims = vi.fn();

vi.mock("@/lib/supabase/server", () => ({
  createClient: async () => ({
    auth: { getClaims },
  }),
}));

import CreateAccountBanner from "./index";

async function renderBanner(hasAccount: boolean) {
  getClaims.mockResolvedValue({
    data: { claims: hasAccount ? { sub: "player-1" } : undefined },
  });

  return renderToStaticMarkup(await CreateAccountBanner());
}

describe("CreateAccountBanner", () => {
  beforeEach(() => {
    getClaims.mockReset();
  });

  it("uses the same collection introduction for every visitor", async () => {
    const signedOut = await renderBanner(false);
    const signedIn = await renderBanner(true);

    for (const markup of [signedOut, signedIn]) {
      expect(markup).toContain("Daily Filipino Word Games");
      expect(markup).toContain("Get More From a Saltong Account");
      expect(markup).toContain(
        "Saltong, Saltong Mini, Saltong Max, and Saltong Hex"
      );
      expect(markup).toContain("Access the Vault");
      expect(markup).toContain("Sync Across Devices");
      expect(markup).toContain("Compete with Friends");
      expect(markup).not.toContain("Full Saltong Experience Unlocked");
      expect(markup).not.toContain("Create a Saltong Account");
    }
  });

  it("keeps account feature destinations appropriate to sign-in state", async () => {
    expect(await renderBanner(false)).toContain('href="/auth"');
    expect(await renderBanner(true)).toContain('href="/play/vault"');
  });
});
