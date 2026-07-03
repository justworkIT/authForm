import { createBrowserClient } from "@supabase/ssr";

function getSupabaseEnv() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY. " +
        "Copy .env.local.example to .env.local and fill in your Supabase project values."
    );
  }

  return { url, anonKey };
}

/**
 * Supabase client for use in Client Components ("use client").
 * Safe to call repeatedly; @supabase/ssr handles session storage via cookies.
 */
export function createClient() {
  const { url, anonKey } = getSupabaseEnv();
  return createBrowserClient(url, anonKey);
}
