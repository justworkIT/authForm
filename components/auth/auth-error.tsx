import { AlertCircle, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Status message for auth forms. Uses role="alert" so screen readers
 * announce it immediately when it appears (errors and confirmations both
 * need this — they're the only feedback a user gets after submitting).
 */
export function AuthStatus({
  message,
  variant = "error",
}: {
  message: string;
  variant?: "error" | "success";
}) {
  const isError = variant === "error";
  return (
    <div
      role="alert"
      className={cn(
        "flex items-start gap-2 rounded-md border px-3 py-2 text-sm",
        isError
          ? "border-destructive/50 bg-destructive/10 text-destructive"
          : "border-green-600/50 bg-green-600/10 text-green-700 dark:text-green-400"
      )}
    >
      {isError ? (
        <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
      ) : (
        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
      )}
      <span>{message}</span>
    </div>
  );
}
