import React from 'react';
import { Routes, Route, useSearchParams } from 'react-router-dom';
import QuizPage from './pages/QuizPage';
import ScoreboardPage from './pages/ScoreboardPage';

// ScoreboardPage stays a plain class component like the other pages; this
// just adapts the ?difficulty= query param (only readable via a hook) into
// a prop it can receive normally.
function ScoreboardRoute() {
  const [searchParams] = useSearchParams();
  const requested = searchParams.get('difficulty');
  const difficulty = ['easy', 'hard', 'challenger'].includes(requested) ? requested : 'easy';
  return <ScoreboardPage difficulty={difficulty} />;
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<QuizPage />} />
      <Route path="/scoreboard" element={<ScoreboardRoute />} />
    </Routes>
  );
}

export default App;
