import type { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Support Saltong Hub - Contribute & Donate",
  description:
    "Support the development of Saltong Hub. Your contributions help us keep the Filipino word games platform running and growing.",
  openGraph: {
    title: "Support Saltong Hub - Contribute & Donate",
    description:
      "Support the development of Saltong Hub. Help us keep Filipino word games free and accessible.",
    type: "website",
    url: "https://saltong.com/contribute",
  },
};

export default function ContributeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
