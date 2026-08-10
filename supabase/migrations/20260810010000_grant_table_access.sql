-- Disabling "Automatically expose new tables" at project creation withholds
-- Postgres' default table grants entirely - RLS policies only restrict
-- which rows an already-permitted role can see, they don't substitute for
-- the underlying grant. service_role needs explicit grants to bypass RLS at
-- all; anon needs one to actually use the "Public can read scores" policy.
grant select, insert, update, delete on quiz_sessions to service_role;
grant select, insert, update, delete on scores to service_role;
grant select on scores to anon;
