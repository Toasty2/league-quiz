import { corsHeaders } from '../_shared/cors.ts';
import { getAdminClient } from '../_shared/supabaseAdmin.ts';
import { errorResponse } from '../_shared/errorResponse.ts';
import { getLatestVersion, getChampionSkins } from '../_shared/ddragon.ts';

const ALLOWED_DIFFICULTIES = ['easy', 'hard', 'challenger'];

function pickRandom(list) {
  return list[Math.floor(Math.random() * list.length)];
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { sessionId, difficulty } = await req.json();
    const resolvedDifficulty = ALLOWED_DIFFICULTIES.includes(difficulty) ? difficulty : 'easy';
    const supabase = getAdminClient();

    const { data: session, error } = await supabase
      .from('quiz_sessions')
      .select('questions, started_at')
      .eq('id', sessionId)
      .single();

    if (error || !session) throw new Error('Session not found');
    if (session.started_at) throw new Error('Session already started');

    const update = { difficulty: resolvedDifficulty };

    // Skin numbers are assigned here, before preloading, so the images
    // fetched during preload match what the game actually displays -
    // splash-proxy responses are cached for 24h, so assigning them any
    // later would mean preload locks in the wrong skin.
    if (resolvedDifficulty === 'challenger') {
      const version = await getLatestVersion();
      update.questions = await Promise.all(
        session.questions.map(async (question) => {
          const skins = await getChampionSkins(version, question.correctChampId);
          return { ...question, skinNum: pickRandom(skins) };
        })
      );
    }

    const { error: updateError } = await supabase
      .from('quiz_sessions')
      .update(update)
      .eq('id', sessionId);

    if (updateError) throw updateError;

    return new Response(JSON.stringify({ difficulty: resolvedDifficulty }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return errorResponse(err, 400, corsHeaders);
  }
});
