import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../button';

function StartScreen({ preparingQuiz, pendingDifficulty, onStart }) {
  return (
    <div className="App">
      <div className="container-bg">
        <main className="app-container">
          <div className="start-screen">
            <h1 className="question-title">League of Legends Quiz</h1>
            <Button
              id="startEasy"
              buttonValue={preparingQuiz && pendingDifficulty === 'easy' ? "Preparing..." : "Baby Mode"}
              onClick={() => onStart('easy')}
              playAudio
            />
            <Button
              id="startHard"
              buttonValue={preparingQuiz && pendingDifficulty === 'hard' ? "Preparing..." : "Hard Mode"}
              onClick={() => onStart('hard')}
              playAudio
            />
            <Button
              id="startChallenger"
              buttonValue={preparingQuiz && pendingDifficulty === 'challenger' ? "Preparing..." : "Challenger"}
              onClick={() => onStart('challenger')}
              playAudio
            />
            <Link to="/scoreboard" className="button answer-button scoreboard-link relative text-center inline-block">
              <img src={require('../../assets/img/button_border.png')} alt="" className="absolute -top-1.5 left-1/2 -translate-x-1/2" />
              Scoreboard
            </Link>
          </div>
        </main>
      </div>
    </div>
  );
}

export default StartScreen;
