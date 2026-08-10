-- Adds "challenger" as a valid difficulty alongside "easy"/"hard". Both
-- check constraints were added inline via "add column ... check (...)" with
-- no explicit name, so Postgres named them using its default convention.
alter table quiz_sessions
  drop constraint quiz_sessions_difficulty_check;

alter table quiz_sessions
  add constraint quiz_sessions_difficulty_check check (difficulty in ('easy', 'hard', 'challenger'));

alter table scores
  drop constraint scores_difficulty_check;

alter table scores
  add constraint scores_difficulty_check check (difficulty in ('easy', 'hard', 'challenger'));
