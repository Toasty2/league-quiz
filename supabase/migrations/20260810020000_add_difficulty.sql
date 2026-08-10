-- Tags each session/score with the mode it was played on ("easy" a.k.a. baby
-- mode, or "hard" with obfuscated splash art), so the scoreboard can be split
-- per mode. Stored as text with a check constraint rather than an int status
-- code, so the column stays self-documenting in ad-hoc queries and a future
-- difficulty tier is just one more allowed value away.
alter table quiz_sessions
  add column difficulty text not null default 'easy' check (difficulty in ('easy', 'hard'));

alter table scores
  add column difficulty text not null default 'easy' check (difficulty in ('easy', 'hard'));
