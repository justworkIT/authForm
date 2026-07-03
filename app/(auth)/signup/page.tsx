import type { Metadata } from "next";
import { AuthCard } from "@/components/auth/auth-card";
import { SignupForm } from "@/components/auth/signup-form";

export const metadata: Metadata = {
  title: "Sign up | AuthForm",
  description: "Create your AuthForm account",
};

export default function SignupPage() {
  return (
    <AuthCard
      title="Create an account"
      description="Sign up with Google or your email to get started."
    >
      <SignupForm />
    </AuthCard>
  );
}
