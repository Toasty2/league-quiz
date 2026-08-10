import React from 'react';
import Button from '../button';

function SubmitScoreScreen({ playerName, submitting, onNameChange, onSubmit }) {
  return (
    <div className="App">
      <div className="container-bg">
        <main className="app-container">
          <div className="start-screen">
            <h1 className="question-title">Enter your name</h1>
            <input type="text" value={playerName} onChange={onNameChange} maxLength={30} />
            <Button id="submitScore" buttonValue={submitting ? "Submitting..." : "Submit score"} onClick={onSubmit} />
          </div>
        </main>
      </div>
    </div>
  );
}

export default SubmitScoreScreen;
