import React, { Suspense } from 'react';
import { Routes, Route, useSearchParams, useNavigate, useLocation } from 'react-router-dom';
import QuizPage from './pages/QuizPage';

const ScoreboardPage = React.lazy(() => import('./pages/ScoreboardPage'));

// QuizPage/ScoreboardPage stay plain class components like the rest of the
// pages; these wrappers adapt router hooks (only usable in function
// components) into props they can receive normally.
function QuizRoute() {
  const navigate = useNavigate();
  return <QuizPage navigate={navigate} />;
}

function ScoreboardRoute() {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const requested = searchParams.get('difficulty');
  const difficulty = ['easy', 'hard', 'challenger'].includes(requested) ? requested : 'easy';
  return (
    <Suspense fallback={<div className="container-bg" />}>
      <ScoreboardPage difficulty={difficulty} highlightSessionId={location.state?.sessionId} />
    </Suspense>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<QuizRoute />} />
      <Route path="/scoreboard" element={<ScoreboardRoute />} />
    </Routes>
  );
}

export default App;
