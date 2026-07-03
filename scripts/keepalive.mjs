// scripts/keepalive.mjs
//
// Writes one row to the `keepalive` table to reset Supabase's free-tier
// 7-day inactivity pause timer. Run by .github/workflows/supabase-keepalive.yml
// on a schedule — not meant to be run as part of the app itself.
//
// Requires SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY as env vars (set as
// GitHub Actions secrets, never committed or exposed client-side — the
// service role key bypasses RLS, unlike the anon key used in the app).

import { createClient } from "@supabase/supabase-js";

const url = process.env.SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceRoleKey) {
  console.error(
    "Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY. " +
      "Set these as repository secrets in GitHub Actions settings."
  );
  process.exit(1);
}

const supabase = createClient(url, serviceRoleKey);

const { error } = await supabase.from("keepalive").insert({});

if (error) {
  console.error("Keep-alive ping failed:", error.message);
  process.exit(1);
}

console.log(`Keep-alive ping succeeded at ${new Date().toISOString()}`);
