import React from 'react';
import { Routes, Route } from 'react-router-dom';
import QuizPage from './pages/QuizPage';
import ScoreboardPage from './pages/ScoreboardPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<QuizPage />} />
      <Route path="/scoreboard" element={<ScoreboardPage />} />
    </Routes>
  );
}

export default App;
