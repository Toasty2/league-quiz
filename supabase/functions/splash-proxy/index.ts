import { corsHeaders } from '../_shared/cors.ts';
import { getAdminClient } from '../_shared/supabaseAdmin.ts';
import { getSplashArtUrl } from '../_shared/ddragon.ts';

// Some skin numbers in Data Dragon's metadata have no matching splash file
// (legacy/removed skins) - fall back to the base skin, which always exists.
async function fetchSplashBytes(champId, skinNum) {
  const response = await fetch(getSplashArtUrl(champId, skinNum));
  if (response.ok) {
    return await response.arrayBuffer();
  }

  const fallback = await fetch(getSplashArtUrl(champId, 0));
  return await fallback.arrayBuffer();
}

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

    const imageBytes = await fetchSplashBytes(question.correctChampId, question.skinNum || 0);

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
