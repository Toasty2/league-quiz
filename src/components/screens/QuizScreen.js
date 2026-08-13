import React from 'react';
import Champion from '../champion';
import Button from '../button';
import { formatElapsedTime } from '../../utils/formatTime';

// Long champion names (e.g. "Heimerdinger") don't fit the mobile answer
// button at the default size - step the font down instead of wrapping/cutting off.
function getNameSizeClass(name) {
  if (name.length >= 14) return 'answer-text-xs';
  if (name.length >= 11) return 'answer-text-sm';
  if (name.length >= 9) return 'answer-text-md';
  return '';
}

function renderAnswerButtons(answerOptions, selectedAnswer, checking, checkingAnswer, onAnswerClick) {
  return answerOptions.map(champ => {
    var isPending = checking && checkingAnswer === champ;
    var isBlocked = checking && checkingAnswer !== champ;
    var baseClass = selectedAnswer === champ ? "button-correct answer" : "answer";
    var stateClass = isPending ? "button-pending" : (isBlocked ? "button-transition" : "");
    var sizeClass = getNameSizeClass(champ);

    return (
      <Button
        key={champ}
        id={champ}
        buttonValue={champ}
        onClick={onAnswerClick}
        disabled={isBlocked}
        className={`${baseClass} ${stateClass} ${sizeClass}`}
        playAudio
      />
    );
  });
}

function QuizScreen({
  sessionId,
  round,
  difficulty,
  answerOptions,
  answered,
  wasUserCorrect,
  selectedAnswer,
  checking,
  checkingAnswer,
  correctChampName,
  streakTier,
  score,
  elapsedMs,
  onAnswerClick,
  onNextRound
}) {
  return (
    <div className="App">
      <div className="container-bg">
        <main className="app-container">
          <div className="grid grid-cols-1 md:grid-cols-2 items-center">
            <div className="py-6 mx-auto">
              <Champion sessionId={sessionId} round={round} difficulty={difficulty} answerOptions={answerOptions} answered={answered} wasUserCorrect={wasUserCorrect} streakTier={streakTier} />
            </div>
            <div className="py-6 items-center">
              {/* max-w matches the answer grid's rendered width so the timer aligns with the button, not the page edge */}
              <div className="quiz-stats-bar grid grid-cols-3 max-w-[672px]">
                <div className="score-title text-left uppercase">
                  Score:<br className="md:hidden" /> {parseInt(score)} / 10
                </div>
                <div className="score-title uppercase">
                  Round:<br className="md:hidden" /> {parseInt(round)} / 10
                </div>
                <div className="score-title text-right uppercase">
                  {formatElapsedTime(elapsedMs)}
                </div>
              </div>


              <div className="grid grid-cols-2 gap-x-8 gap-y-6 py-6">
                {answered ? "" : renderAnswerButtons(answerOptions, selectedAnswer, checking, checkingAnswer, onAnswerClick)}
              </div>
              <div className={`right-answer ${wasUserCorrect && answered ? "correct" : ""}`}>
                <h2 className="result-heading">Correct!</h2>
                <p className="score-title">{correctChampName}</p>
                <img src={require('../../assets/img/Bee_Correct.avif')} alt="Correct answer" />
                <Button id="nextRound" buttonValue={round >= 10 ? "See results" : "Next round"} onClick={onNextRound} />
              </div>
              <div className={`wrong-answer ${!wasUserCorrect && answered ? "incorrect" : ""}`}>
                <h2 className="result-heading">Wrong!</h2>
                <p className="score-title">{correctChampName}</p>
                <img src={require('../../assets/img/Bee_Incorrect.avif')} alt="Wrong answer" />
                <Button id="nextRound" buttonValue={round >= 10 ? "See results" : "Next round"} onClick={onNextRound} />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default QuizScreen;
