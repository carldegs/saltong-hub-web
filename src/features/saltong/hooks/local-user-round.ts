import type { SaltongUserRound, SaltongUserRoundPrimaryKeys } from "../types";

export type LocalSaltongUserRoundMutationParams = Omit<
  SaltongUserRound,
  "startedAt" | "updatedAt"
> & {
  startedAt?: SaltongUserRound["startedAt"];
} & SaltongUserRoundPrimaryKeys;

export function isLocalSaltongUserRoundMatch(
  round: SaltongUserRound,
  params: SaltongUserRoundPrimaryKeys
) {
  return (
    round.userId === params.userId &&
    round.mode === params.mode &&
    round.date === params.date
  );
}

export function findLocalSaltongUserRound(
  rounds: SaltongUserRound[] | null | undefined,
  params: SaltongUserRoundPrimaryKeys
) {
  return rounds?.find((round) => isLocalSaltongUserRoundMatch(round, params));
}

export function upsertLocalSaltongUserRound(
  rounds: SaltongUserRound[],
  params: LocalSaltongUserRoundMutationParams,
  now = new Date().toISOString()
): SaltongUserRound[] {
  const existingIndex = rounds.findIndex((round) =>
    isLocalSaltongUserRoundMatch(round, params)
  );

  const datedParams = {
    ...params,
    startedAt: params.startedAt ?? now,
    updatedAt: now,
  };

  if (existingIndex > -1) {
    const updatedRounds = [...rounds];
    updatedRounds[existingIndex] = {
      ...updatedRounds[existingIndex],
      ...datedParams,
    };
    return updatedRounds;
  }

  return [...rounds, datedParams];
}
