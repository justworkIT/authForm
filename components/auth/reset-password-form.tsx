"use client";

import { useFormState, useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { PasswordInput } from "@/components/auth/password-input";
import { AuthStatus } from "@/components/auth/auth-error";
import { updatePassword, type AuthActionState } from "@/app/(auth)/actions";

const initialState: AuthActionState = {};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full" disabled={pending} aria-busy={pending}>
      {pending ? "Updating…" : "Update password"}
    </Button>
  );
}

export function ResetPasswordForm() {
  const [state, formAction] = useFormState(updatePassword, initialState);

  return (
    <div className="space-y-4">
      {state.error && <AuthStatus message={state.error} variant="error" />}

      <form action={formAction} className="space-y-4" noValidate>
        <div className="space-y-2">
          <Label htmlFor="password">New password</Label>
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

        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirm new password</Label>
          <PasswordInput
            id="confirmPassword"
            name="confirmPassword"
            autoComplete="new-password"
            required
          />
        </div>

        <SubmitButton />
      </form>
    </div>
  );
}
