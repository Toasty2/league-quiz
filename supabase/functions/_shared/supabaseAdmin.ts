import { createClient } from 'npm:@supabase/supabase-js@2';

// SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are auto-injected by Supabase
// for every deployed Edge Function - never set manually, never client-side.
export function getAdminClient() {
  return createClient(
    Deno.env.get('SUPABASE_URL'),
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
  );
}
