-- quiz_sessions holds the answer key for each session. No RLS policies are
-- defined for it, so with RLS enabled, anon/authenticated clients get zero
-- access - only the service role (used inside Edge Functions) can read or
-- write it, since service role bypasses RLS entirely.
create table quiz_sessions (
  id uuid primary key default gen_random_uuid(),
  questions jsonb not null,
  -- Server-recorded result per round, e.g. {"0": true, "1": false}. Keyed by
  -- round so check-answer can refuse to re-check a round already answered -
  -- otherwise a client could brute-force guesses or replay a correct round
  -- to inflate its tally.
  answers jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  -- Set by begin-session once round 1 is actually about to be shown (after
  -- splash art preloading), not at row creation - so preload time on a slow
  -- connection never counts against the player's elapsed time.
  started_at timestamptz,
  finished_at timestamptz
);

alter table quiz_sessions enable row level security;

-- scores is the public leaderboard: readable by anyone, writable only via
-- the service role (submit-quiz Edge Function), never directly by a client.
create table scores (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references quiz_sessions(id),
  player_name text not null check (char_length(player_name) between 1 and 30),
  correct_count integer not null,
  elapsed_ms bigint not null,
  final_score integer not null,
  created_at timestamptz not null default now()
);

alter table scores enable row level security;

create policy "Public can read scores"
  on scores for select
  using (true);
