import React from 'react';
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
            />
            <Button
              id="startHard"
              buttonValue={preparingQuiz && pendingDifficulty === 'hard' ? "Preparing..." : "Hard Mode"}
              onClick={() => onStart('hard')}
            />
          </div>
        </main>
      </div>
    </div>
  );
}

export default StartScreen;
