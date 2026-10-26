"use client";

import type { ReactNode } from "react";
import {
  ConsentBanner,
  ConsentDialog,
  ConsentManagerProvider,
} from "@c15t/nextjs";

export function ConsentManager({ children }: { children: ReactNode }) {
  return (
    <ConsentManagerProvider
      options={{
        mode: "offline",
        consentCategories: ["necessary", "marketing", "measurement"], // Optional: Specify which consent categories to show in the banner.
        legalLinks: {
          privacyPolicy: {
            href: "/policies/privacy",
            label: "Privacy Policy",
          },
          cookiePolicy: {
            href: "/policies/cookies",
            label: "Cookie Policy",
          },
          termsOfService: {
            href: "/policies/terms",
            label: "Terms and Conditions",
          },
        },
      }}
    >
      <ConsentBanner
        legalLinks={["privacyPolicy", "termsOfService", "cookiePolicy"]}
      />
      <ConsentDialog />
      {children}
    </ConsentManagerProvider>
  );
}
