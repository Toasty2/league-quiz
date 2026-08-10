import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.REACT_APP_SUPABASE_URL,
  process.env.REACT_APP_SUPABASE_PUBLISHABLE_KEY
);

function invoke(name, body) {
  return supabase.functions.invoke(name, { body }).then(({ data, error }) => {
    if (error) throw error;
    return data;
  });
}

export function startQuizSession() {
  return invoke('start-quiz');
}

export function setDifficulty(sessionId, difficulty) {
  return invoke('set-difficulty', { sessionId, difficulty });
}

export function beginSession(sessionId) {
  return invoke('begin-session', { sessionId });
}

export function checkAnswer(sessionId, round, selected) {
  return invoke('check-answer', { sessionId, round, selected });
}

export function submitQuiz(sessionId, playerName) {
  return invoke('submit-quiz', { sessionId, playerName });
}

export function getSplashProxyUrl(sessionId, round) {
  return `${process.env.REACT_APP_SUPABASE_URL}/functions/v1/splash-proxy?session=${sessionId}&round=${round}`;
}

export function getLeaderboard(difficulty, limit = 20) {
  return supabase
    .from('scores')
    .select('session_id, player_name, correct_count, elapsed_ms, final_score, created_at')
    .eq('difficulty', difficulty)
    .order('final_score', { ascending: false })
    .limit(limit)
    .then(({ data, error }) => {
      if (error) throw error;
      return data;
    });
}
