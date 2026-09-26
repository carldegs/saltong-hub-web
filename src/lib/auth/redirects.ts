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

export function createPasswordRecoveryRedirectUrl(baseUrl = getRedirectURL()) {
  return new URL(baseUrl).origin;
}

export function getAuthReturnTo(searchParams: URLSearchParams) {
  return validateRedirect(
    searchParams.get("returnTo") ?? searchParams.get("next") ?? "/"
  );
}

export function createAuthConfirmationRedirectUrl(
  requestUrl: string,
  returnTo: string
) {
  const redirectTo = new URL(requestUrl);
  redirectTo.pathname = validateRedirect(returnTo);
  redirectTo.search = "";

  return redirectTo;
}
