import { createElement, type ReactNode } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

const { getProfileFormData } = vi.hoisted(() => ({
  getProfileFormData: vi.fn(),
}));

vi.mock("@/lib/supabase/server", () => ({
  createClient: vi.fn().mockResolvedValue({
    auth: {
      getClaims: vi.fn().mockResolvedValue({
        data: { claims: { sub: "user-id" } },
        error: null,
      }),
    },
  }),
}));

vi.mock("@/features/profiles/utils", () => ({ getProfileFormData }));
vi.mock("@/app/components/home-navbar-brand", () => ({ default: () => null }));
vi.mock("@/components/shared/navbar", () => ({
  Navbar: ({ children }: { children: ReactNode }) => children,
}));
vi.mock("../components/account-settings-profile-form", () => ({
  default: () => createElement("div", null, "Profile form"),
}));
vi.mock("../components/change-password-form", () => ({
  ChangePasswordForm: () => createElement("div", null, "Change Password"),
}));
vi.mock("./provider-card", () => ({
  default: () => createElement("div", null, "Provider"),
}));

import SettingsPage from "./page";

describe("Account settings", () => {
  beforeEach(() => {
    getProfileFormData.mockResolvedValue({
      profile: { id: "user-id", username: "tester" },
      isTemporaryProfile: false,
      avatarOptions: [],
    });
  });

  it("shows Change Password to users with an email identity", async () => {
    getProfileFormData.mockResolvedValueOnce({
      profile: { id: "user-id", username: "tester" },
      isTemporaryProfile: false,
      avatarOptions: [],
      identitiesData: { identities: [{ id: "email-id", provider: "email" }] },
    });

    const markup = renderToStaticMarkup(await SettingsPage());

    expect(markup).toContain("Change Password");
  });

  it("does not show Change Password to OAuth-only users", async () => {
    getProfileFormData.mockResolvedValueOnce({
      profile: { id: "user-id", username: "tester" },
      isTemporaryProfile: false,
      avatarOptions: [],
      identitiesData: {
        identities: [{ id: "google-id", provider: "google" }],
      },
    });

    const markup = renderToStaticMarkup(await SettingsPage());

    expect(markup).not.toContain("Change Password");
  });
});
