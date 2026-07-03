-- Minimal table the keep-alive GitHub Action writes to.
-- A real write is what resets Supabase's 7-day inactivity pause timer;
-- just calling the API without touching the DB does not count.
create table if not exists public.keepalive (
  id bigint generated always as identity primary key,
  pinged_at timestamptz not null default now()
);

-- RLS on by default for safety; no public read/write policy is added,
-- since only the service role (used by the GitHub Action) needs access.
alter table public.keepalive enable row level security;

-- Keep only recent pings so the table doesn't grow forever.
-- (Run manually or via a second scheduled job if you want automatic pruning;
-- for a low-traffic keep-alive, a handful of rows a month is negligible.)
