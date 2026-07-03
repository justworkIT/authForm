import type { Metadata } from "next";
import { AuthCard } from "@/components/auth/auth-card";
import { LoginForm } from "@/components/auth/login-form";

export const metadata: Metadata = {
  title: "Log in | AuthForm",
  description: "Log in to your AuthForm account",
};

export default function LoginPage() {
  return (
    <AuthCard
      title="Welcome back"
      description="Log in with Google or your email."
    >
      <LoginForm />
    </AuthCard>
  );
}
