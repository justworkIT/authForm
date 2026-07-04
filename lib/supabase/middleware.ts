import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

/**
 * Refreshes the Supabase session cookie on every request.
 * Without this, sessions silently expire mid-visit because Server
 * Components can't write cookies themselves.
 */
export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({
    request: { headers: request.headers },
  });

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    // Throwing a descriptive error here turns an opaque Vercel
    // MIDDLEWARE_INVOCATION_FAILED into a readable message in Runtime Logs.
    throw new Error(
      "Middleware failed: NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY " +
        "is not set. If deployed on Vercel, add both in Project Settings > " +
        "Environment Variables (for Production, Preview, and Development), then redeploy."
    );
  }

  const supabase = createServerClient(url, anonKey, {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({ name, value, ...options });
          response = NextResponse.next({
            request: { headers: request.headers },
          });
          response.cookies.set({ name, value, ...options });
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({ name, value: "", ...options });
          response = NextResponse.next({
            request: { headers: request.headers },
          });
          response.cookies.set({ name, value: "", ...options });
        },
      },
    }
  );

  // Touching getUser() is what actually triggers the refresh.
  await supabase.auth.getUser();

  return response;
}
