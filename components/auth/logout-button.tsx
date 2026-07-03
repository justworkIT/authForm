"use client";

import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { logout } from "@/app/(auth)/actions";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" variant="outline" disabled={pending} aria-busy={pending}>
      {pending ? "Logging out…" : "Log out"}
    </Button>
  );
}

export function LogoutButton() {
  return (
    <form action={logout}>
      <SubmitButton />
    </form>
  );
}
