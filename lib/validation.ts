/**
 * Pure validation helpers for auth forms. Kept separate from actions.ts
 * (a "use server" file) specifically so they can be unit-tested without
 * spinning up the Next.js server runtime.
 */

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function isValidPassword(password: string): boolean {
  return password.length >= 8;
}

export function passwordsMatch(password: string, confirmPassword: string): boolean {
  return password === confirmPassword;
}
