import { corsHeaders } from '../_shared/cors.ts';
import { getAdminClient } from '../_shared/supabaseAdmin.ts';
import { getSplashArtUrl } from '../_shared/ddragon.ts';

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const sessionId = url.searchParams.get('session');
    const round = url.searchParams.get('round');

    if (!sessionId || round === null) {
      throw new Error('Missing session or round');
    }

    const supabase = getAdminClient();
    const { data: session, error } = await supabase
      .from('quiz_sessions')
      .select('questions')
      .eq('id', sessionId)
      .single();

    if (error || !session) throw new Error('Session not found');

    const question = session.questions[Number(round)];
    if (!question) throw new Error('Invalid round');

    const imageResponse = await fetch(getSplashArtUrl(question.correctChampId));
    const imageBytes = await imageResponse.arrayBuffer();

    return new Response(imageBytes, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'image/jpeg',
        'Cache-Control': 'public, max-age=86400',
      },
    });
  } catch (err) {
    return new Response(err && err.message ? err.message : String(err), { status: 400, headers: corsHeaders });
  }
});
