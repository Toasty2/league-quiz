import React from 'react';
import { Link } from 'react-router-dom';

const scoreText = [
  "I guess you don't play League of Legends, huh?",
  "Did you guess it?",
  "Seems like you got lucky",
  "Maybe you know one or two",
  "Not bad, you knew a few",
  "You got half of them!",
  "Pretty good",
  "Nice one, you only missed a few",
  "Very good, you only missed a couple",
  "Nearly a perfect score!",
  "You a winner!"
];

function ResultsScreen({ score, finalScore, difficulty, onReset }) {
  return (
    <div id="app" className="App">
      <div className="container-bg">
        <div className="app-container">
          <h1 className="score-title">{parseInt(score)} / 10</h1>
          <h1 className="score-title">{scoreText[parseInt(score)]}</h1>
          <h1 className="score-title">Final Score: {finalScore}</h1>
          <button onClick={onReset}>Reset</button>
          <Link to={`/scoreboard?difficulty=${difficulty}`} className="score-title">View Scoreboard</Link>
        </div>
      </div>

    </div>
  );
}

export default ResultsScreen;
