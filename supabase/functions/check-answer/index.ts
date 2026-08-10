import { corsHeaders } from '../_shared/cors.ts';
import { getAdminClient } from '../_shared/supabaseAdmin.ts';
import { errorResponse } from '../_shared/errorResponse.ts';

const QUESTION_COUNT = 10;

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { sessionId, round, selected } = await req.json();
    const supabase = getAdminClient();

    const { data: session, error } = await supabase
      .from('quiz_sessions')
      .select('questions, answers, started_at, finished_at')
      .eq('id', sessionId)
      .single();

    if (error || !session) throw new Error('Session not found');
    if (!session.started_at) throw new Error('Session not started');
    if (session.finished_at) throw new Error('Session already finished');

    // A round can only ever be checked once - otherwise a client could
    // brute-force guesses, or replay a correct round to inflate its tally.
    const roundKey = String(round);
    if (roundKey in session.answers) {
      throw new Error('Round already answered');
    }

    const question = session.questions[round];
    if (!question) throw new Error('Invalid round');

    const correct = selected === question.correctChampName;
    const updatedAnswers = { ...session.answers, [roundKey]: correct };

    // Stamp finished_at the instant the last round is answered - not later,
    // when submit-quiz runs - so time spent entering a name for the
    // scoreboard never counts against the player.
    const update = { answers: updatedAnswers };
    if (Object.keys(updatedAnswers).length >= QUESTION_COUNT) {
      update.finished_at = new Date().toISOString();
    }

    const { error: updateError } = await supabase
      .from('quiz_sessions')
      .update(update)
      .eq('id', sessionId);

    if (updateError) throw updateError;

    return new Response(JSON.stringify({ correct }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return errorResponse(err, 400, corsHeaders);
  }
});
