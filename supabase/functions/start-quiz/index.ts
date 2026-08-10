import { corsHeaders } from '../_shared/cors.ts';
import { getAdminClient } from '../_shared/supabaseAdmin.ts';
import { getLatestVersion, getChampionList } from '../_shared/ddragon.ts';
import { errorResponse } from '../_shared/errorResponse.ts';

const QUESTION_COUNT = 10;
const OPTION_COUNT = 4;

function shuffle(array) {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

function pickRandom(list) {
  return list[Math.floor(Math.random() * list.length)];
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const version = await getLatestVersion();
    const champions = await getChampionList(version);

    const questions = [];
    for (let i = 0; i < QUESTION_COUNT; i++) {
      const correct = pickRandom(champions);
      const wrongPool = champions.filter((c) => c.id !== correct.id);

      const wrongOptions = [];
      while (wrongOptions.length < OPTION_COUNT - 1) {
        const candidate = pickRandom(wrongPool);
        if (!wrongOptions.some((c) => c.id === candidate.id)) {
          wrongOptions.push(candidate);
        }
      }

      questions.push({
        correctChampId: correct.id,
        correctChampName: correct.name,
        options: shuffle([correct, ...wrongOptions].map((c) => c.name)),
      });
    }

    const supabase = getAdminClient();
    const { data, error } = await supabase
      .from('quiz_sessions')
      .insert({ questions })
      .select('id')
      .single();

    if (error) throw error;

    // Only the options ever go to the client - never which one is correct.
    const publicQuestions = questions.map((q) => ({ options: q.options }));

    return new Response(
      JSON.stringify({ sessionId: data.id, questions: publicQuestions }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (err) {
    return errorResponse(err, 500, corsHeaders);
  }
});
