type SignOutError = {
  message: string;
};

export type PasswordChangeSignOutClient = {
  auth: {
    signOut: (options: { scope: "global" | "local" }) => Promise<{
      error: SignOutError | null;
    }>;
  };
};

export async function signOutAfterPasswordChange(
  client: PasswordChangeSignOutClient
): Promise<{
  localSessionCleared: boolean;
  globalRevocationFailed: boolean;
}> {
  const { error: globalError } = await client.auth.signOut({ scope: "global" });

  if (!globalError) {
    return { localSessionCleared: true, globalRevocationFailed: false };
  }

  const { error: localError } = await client.auth.signOut({ scope: "local" });

  return {
    localSessionCleared: !localError,
    globalRevocationFailed: true,
  };
}
