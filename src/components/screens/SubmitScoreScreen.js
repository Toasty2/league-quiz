import React from 'react';
import Button from '../button';

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

function SubmitScoreScreen({ score, playerName, submitting, onNameChange, onSubmit }) {
  return (
    <div className="App">
      <div className="container-bg">
        <main className="app-container">
          <div className="start-screen">
            <h1 className="question-title">{parseInt(score)} / 10</h1>
            <h1 className="score-title">{scoreText[parseInt(score)]}</h1>
            <h1 className="score-title">Enter your name</h1>
            <input type="text" value={playerName} onChange={onNameChange} maxLength={30} />
            <Button id="submitScore" buttonValue={submitting ? "Submitting..." : "Submit score"} onClick={onSubmit} />
          </div>
        </main>
      </div>
    </div>
  );
}

export default SubmitScoreScreen;
