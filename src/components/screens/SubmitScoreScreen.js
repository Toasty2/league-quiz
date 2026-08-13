import React from 'react';
import Button from '../button';
import { formatElapsedTime } from '../../utils/formatTime';

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

function SubmitScoreScreen({ correctCount, elapsedMs, playerName, submitting, onNameChange, onSubmit }) {
  return (
    <div className="App">
      <div className="container-bg">
        <main className="app-container">
          <div className="start-screen">
            <h1 className="font-['Beaufort'] text-[90px] font-black leading-[113.76px] tracking-[-0.01em] text-[#F0E6D2] uppercase">{parseInt(correctCount)} / 10</h1>
            <h1 className="font-['Beaufort'] text-[48px] font-black leading-[113.76px] tracking-[-0.01em] text-[#F0E6D2] uppercase">{formatElapsedTime(elapsedMs)}</h1>
            <h1 className="score-title">{scoreText[parseInt(correctCount)]}</h1>
            <p className="font-['Beaufort'] font-normal text-[18px] text-[#F0E6D2] text-center max-w-md">Enter your name to submit your score and see the scoreboard</p>
            <input type="text" value={playerName} onChange={onNameChange} maxLength={30} />
            <Button id="submitScore" buttonValue={submitting ? "Submitting..." : "Submit score"} onClick={onSubmit} />
          </div>
        </main>
      </div>
    </div>
  );
}

export default SubmitScoreScreen;
