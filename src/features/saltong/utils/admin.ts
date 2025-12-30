/**
 * Utility functions for admin operations
 */

export function formatErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === "string") {
    return error;
  }
  return "An unknown error occurred";
}

export function validateRoundCount(
  count: number,
  max: number
): {
  isValid: boolean;
  error?: string;
} {
  if (count <= 0) {
    return { isValid: false, error: "Count must be greater than 0" };
  }
  if (count > max) {
    return { isValid: false, error: `Maximum ${max} rounds allowed` };
  }
  return { isValid: true };
}
