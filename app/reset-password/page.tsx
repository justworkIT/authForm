import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AuthCard } from "@/components/auth/auth-card";
import { ResetPasswordForm } from "@/components/auth/reset-password-form";

export const metadata: Metadata = {
  title: "Set new password | AuthForm",
  description: "Choose a new password for your account",
};

export default async function ResetPasswordPage() {
  // Reaching this page requires the /auth/callback exchange to have already
  // run and set a recovery session — if there's no user, the link was
  // invalid or expired.
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/forgot-password");
  }

  return (
    <AuthCard
      title="Set a new password"
      description="Choose a new password for your account."
    >
      <ResetPasswordForm />
    </AuthCard>
  );
}
