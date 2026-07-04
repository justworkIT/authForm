"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { isValidEmail, isValidPassword, passwordsMatch } from "@/lib/validation";

export type AuthActionState = {
  error?: string;
  success?: boolean;
  message?: string;
};

/**
 * Creates a new account with email + password.
 * Server-side validation is authoritative — the client-side checks in
 * SignupForm are only a UX nicety and must never be trusted alone.
 */
export async function signUpWithEmail(
  _prevState: AuthActionState,
  formData: FormData
): Promise<AuthActionState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!isValidEmail(email)) {
    return { error: "Enter a valid email address." };
  }
  if (!isValidPassword(password)) {
    return { error: "Password must be at least 8 characters." };
  }

  const supabase = createClient();
  const origin = headers().get("origin");

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/auth/callback`,
    },
  });

  if (error) {
    // Supabase returns "User already registered" for duplicates.
    if (error.message.toLowerCase().includes("already registered")) {
      return { error: "An account with this email already exists." };
    }
    return { error: error.message };
  }

  return {
    success: true,
    message: "Check your email to confirm your account before logging in.",
  };
}

/**
 * Signs in with email + password.
 * Deliberately returns one generic message for bad credentials so the
 * response doesn't reveal whether the email exists (avoids user enumeration).
 */
export async function signInWithEmail(
  _prevState: AuthActionState,
  formData: FormData
): Promise<AuthActionState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!isValidEmail(email) || password.length === 0) {
    return { error: "Enter your email and password." };
  }

  const supabase = createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    if (error.message.toLowerCase().includes("email not confirmed")) {
      return { error: "Please confirm your email before logging in." };
    }
    return { error: "Invalid email or password." };
  }

  revalidatePath("/", "layout");
  redirect("/dashboard");
}

/** Starts the Google OAuth flow and redirects to Supabase's provider URL. */
export async function signInWithGoogle() {
  const supabase = createClient();
  const origin = headers().get("origin");

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${origin}/auth/callback`,
    },
  });

  if (error || !data.url) {
    redirect("/login?error=oauth_failed");
  }

  redirect(data.url);
}

export async function logout() {
  const supabase = createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/login");
}

/**
 * Sends a password-reset email. Always returns a generic success message,
 * even if the email doesn't exist — otherwise this endpoint becomes a way
 * to check which emails have accounts (user enumeration).
 */
export async function requestPasswordReset(
  _prevState: AuthActionState,
  formData: FormData
): Promise<AuthActionState> {
  const email = String(formData.get("email") ?? "").trim();

  if (!isValidEmail(email)) {
    return { error: "Enter a valid email address." };
  }

  const supabase = createClient();
  const origin = headers().get("origin");

  // Intentionally ignore the error here (beyond logging) — see doc comment.
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/callback?next=/reset-password`,
  });

  if (error) {
    console.error("resetPasswordForEmail error:", error.message);
  }

  return {
    success: true,
    message: "If an account exists for that email, a reset link is on its way.",
  };
}

/**
 * Sets a new password. Only works within an active recovery session,
 * i.e. after the user has clicked a valid reset link and landed here
 * via the OAuth-style callback exchange.
 */
export async function updatePassword(
  _prevState: AuthActionState,
  formData: FormData
): Promise<AuthActionState> {
  const password = String(formData.get("password") ?? "");
  const confirmPassword = String(formData.get("confirmPassword") ?? "");

  if (!isValidPassword(password)) {
    return { error: "Password must be at least 8 characters." };
  }
  if (!passwordsMatch(password, confirmPassword)) {
    return { error: "Passwords do not match." };
  }

  const supabase = createClient();

  // Requires an active session — reset links exchange a code for one via
  // /auth/callback before the user ever reaches this action.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      error: "Your reset link has expired. Request a new one.",
    };
  }

  const { error } = await supabase.auth.updateUser({ password });

  if (error) {
    return { error: error.message };
  }

  redirect("/login?reset=success");
}
