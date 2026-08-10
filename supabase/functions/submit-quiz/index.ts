import { corsHeaders } from '../_shared/cors.ts';
import { getAdminClient } from '../_shared/supabaseAdmin.ts';
import { errorResponse } from '../_shared/errorResponse.ts';

const POINTS_PER_CORRECT = 1000;
const PENALTY_PER_SECOND = 10;

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { sessionId, playerName } = await req.json();
    const trimmedName = String(playerName || '').trim();
    if (trimmedName.length < 1 || trimmedName.length > 30) {
      throw new Error('Invalid player name');
    }

    const supabase = getAdminClient();

    const { data: session, error } = await supabase
      .from('quiz_sessions')
      .select('answers, started_at, finished_at, difficulty')
      .eq('id', sessionId)
      .single();

    if (error || !session) throw new Error('Session not found');
    if (!session.started_at) throw new Error('Session not started');
    if (!session.finished_at) throw new Error('Quiz not complete');

    const { data: existingScore } = await supabase
      .from('scores')
      .select('id')
      .eq('session_id', sessionId)
      .maybeSingle();

    if (existingScore) throw new Error('Score already submitted');

    const correctCount = Object.values(session.answers).filter(Boolean).length;
    const elapsedMs = new Date(session.finished_at).getTime() - new Date(session.started_at).getTime();
    const elapsedSeconds = elapsedMs / 1000;
    const finalScore = Math.max(
      0,
      Math.round(correctCount * POINTS_PER_CORRECT - elapsedSeconds * PENALTY_PER_SECOND)
    );

    const { error: scoreError } = await supabase.from('scores').insert({
      session_id: sessionId,
      player_name: trimmedName,
      correct_count: correctCount,
      elapsed_ms: elapsedMs,
      final_score: finalScore,
      difficulty: session.difficulty,
    });

    if (scoreError) throw scoreError;

    return new Response(JSON.stringify({ correctCount, elapsedMs, finalScore }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return errorResponse(err, 400, corsHeaders);
  }
});
