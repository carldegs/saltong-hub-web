/**
 * Validates and sanitizes a redirect URL to prevent open redirect vulnerabilities.
 * Only allows relative URLs that start with '/'.
 *
 * @param redirect - The URL to validate
 * @returns The validated redirect URL, or '/' if invalid
 */
export function validateRedirect(redirect: string | undefined | null): string {
  if (!redirect) {
    return "/";
  }

  // Ensure it's a string
  if (typeof redirect !== "string") {
    return "/";
  }

  // Trim whitespace
  const trimmed = redirect.trim();

  // Must be a relative URL starting with /
  if (!trimmed.startsWith("/")) {
    return "/";
  }

  // Prevent double slash protocol escapes like //evil.com
  if (trimmed.startsWith("//")) {
    return "/";
  }

  // Additional check: ensure no protocol is present (should not contain :)
  // But allow # for anchors
  const beforeHash = trimmed.split("#")[0];
  if (beforeHash.includes(":")) {
    return "/";
  }

  return trimmed;
}
