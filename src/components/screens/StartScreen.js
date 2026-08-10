import React from 'react';
import Button from '../button';

function StartScreen({ preparingQuiz, onStart }) {
  return (
    <div className="App">
      <div className="container-bg">
        <main className="app-container">
          <div className="start-screen">
            <h1 className="question-title">League of Legends Quiz</h1>
            <Button id="startQuiz" buttonValue={preparingQuiz ? "Preparing..." : "Start"} onClick={onStart} />
          </div>
        </main>
      </div>
    </div>
  );
}

export default StartScreen;
