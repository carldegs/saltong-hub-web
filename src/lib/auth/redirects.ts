import { getRedirectURL } from "@/lib/utils";
import { validateRedirect } from "./validate-redirect";

export function createAuthCallbackUrl(
  returnTo: string,
  baseUrl = getRedirectURL()
) {
  const callbackUrl = new URL("auth/callback", baseUrl);
  callbackUrl.searchParams.set("returnTo", validateRedirect(returnTo));

  return callbackUrl.toString();
}
