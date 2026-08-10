import { corsHeaders } from '../_shared/cors.ts';
import { getAdminClient } from '../_shared/supabaseAdmin.ts';
import { errorResponse } from '../_shared/errorResponse.ts';

const ABANDONED_AFTER_HOURS = 24;

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const cutoff = new Date(Date.now() - ABANDONED_AFTER_HOURS * 60 * 60 * 1000).toISOString();
    const supabase = getAdminClient();

    const { data, error } = await supabase
      .from('quiz_sessions')
      .delete()
      .eq('answers', '{}')
      .lt('created_at', cutoff)
      .select('id');

    if (error) throw error;

    return new Response(JSON.stringify({ deleted: data.length }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return errorResponse(err, 500, corsHeaders);
  }
});
