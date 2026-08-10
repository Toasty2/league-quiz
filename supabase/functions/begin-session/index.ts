import { corsHeaders } from '../_shared/cors.ts';
import { getAdminClient } from '../_shared/supabaseAdmin.ts';
import { errorResponse } from '../_shared/errorResponse.ts';

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { sessionId } = await req.json();
    const supabase = getAdminClient();

    const { data: session, error } = await supabase
      .from('quiz_sessions')
      .select('started_at')
      .eq('id', sessionId)
      .single();

    if (error || !session) throw new Error('Session not found');
    if (session.started_at) throw new Error('Session already started');

    const { error: updateError } = await supabase
      .from('quiz_sessions')
      .update({ started_at: new Date().toISOString() })
      .eq('id', sessionId);

    if (updateError) throw updateError;

    return new Response(JSON.stringify({ started: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return errorResponse(err, 400, corsHeaders);
  }
});
