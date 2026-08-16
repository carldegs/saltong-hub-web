import type { Metadata } from "next";

export const SITE_URL = "https://www.saltong.com";

export function canonicalUrl(path: string) {
  return new URL(path, SITE_URL).toString();
}

export function pageIndexingMetadata(
  path: string,
  indexable: boolean
): Pick<Metadata, "alternates" | "robots"> {
  return {
    alternates: { canonical: canonicalUrl(path) },
    robots: { index: indexable, follow: true },
  };
}
