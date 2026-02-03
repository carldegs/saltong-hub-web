// 8-character alphanumeric code. uppercase letters, remove confusing chars

const ALPHANUMERIC_CHARACTERS = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";

export function generateInviteCode(length: number = 8): string {
  let result = "";
  const charactersLength = ALPHANUMERIC_CHARACTERS.length;

  for (let i = 0; i < length; i++) {
    result += ALPHANUMERIC_CHARACTERS.charAt(
      Math.floor(Math.random() * charactersLength)
    );
  }

  return result;
}
