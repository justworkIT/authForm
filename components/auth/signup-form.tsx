"use client";

import { useFormState, useFormStatus } from "react-dom";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { PasswordInput } from "@/components/auth/password-input";
import { AuthStatus } from "@/components/auth/auth-error";
import { GoogleOAuthButton } from "@/components/auth/google-oauth-button";
import { signUpWithEmail, type AuthActionState } from "@/app/(auth)/actions";

const initialState: AuthActionState = {};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full" disabled={pending} aria-busy={pending}>
      {pending ? "Creating account…" : "Create account"}
    </Button>
  );
}

export function SignupForm() {
  const [state, formAction] = useFormState(signUpWithEmail, initialState);

  return (
    <div className="space-y-4">
      <GoogleOAuthButton />

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <Separator />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-card px-2 text-muted-foreground">
            Or continue with email
          </span>
        </div>
      </div>

      {state.error && <AuthStatus message={state.error} variant="error" />}
      {state.success && state.message && (
        <AuthStatus message={state.message} variant="success" />
      )}

      {!state.success && (
        <form action={formAction} className="space-y-4" noValidate>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <PasswordInput
              id="password"
              name="password"
              autoComplete="new-password"
              placeholder="At least 8 characters"
              minLength={8}
              required
              aria-describedby="password-hint"
            />
            <p id="password-hint" className="text-xs text-muted-foreground">
              Must be at least 8 characters.
            </p>
          </div>

          <SubmitButton />
        </form>
      )}

      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-primary hover:underline">
          Log in
        </Link>
      </p>
    </div>
  );
}
