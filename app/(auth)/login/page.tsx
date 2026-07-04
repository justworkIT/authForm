import type { Metadata } from "next";
import { AuthCard } from "@/components/auth/auth-card";
import { LoginForm } from "@/components/auth/login-form";
import { AuthStatus } from "@/components/auth/auth-error";

export const metadata: Metadata = {
  title: "Log in | AuthForm",
  description: "Log in to your AuthForm account",
};

export default function LoginPage({
  searchParams,
}: {
  searchParams: { reset?: string };
}) {
  return (
    <AuthCard
      title="Welcome back"
      description="Log in with Google or your email."
    >
      <div className="space-y-4">
        {searchParams.reset === "success" && (
          <AuthStatus
            message="Password updated. Log in with your new password."
            variant="success"
          />
        )}
        <LoginForm />
      </div>
    </AuthCard>
  );
}
