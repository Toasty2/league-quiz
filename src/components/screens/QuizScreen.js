import React from 'react';
import Champion from '../champion';
import Button from '../button';
import { formatElapsedTime } from '../../utils/formatTime';

function renderAnswerButtons(answerOptions, selectedAnswer, onAnswerClick) {
  return answerOptions.map(champ => (
    <div className="p-6" key={champ}>
      <Button id={champ} buttonValue={champ} onClick={onAnswerClick} className={`${selectedAnswer === champ ? "button-correct answer" : "answer"}`} />
    </div>
  ));
}

function QuizScreen({
  sessionId,
  round,
  difficulty,
  answerOptions,
  answered,
  wasUserCorrect,
  selectedAnswer,
  score,
  elapsedMs,
  resultGifUrl,
  onAnswerClick,
  onNextRound
}) {
  return (
    <div className="App">
      <div className="container-bg">
        <main className="app-container">
          <div className="grid grid-cols-1 md:grid-cols-2 items-center">
            <div className="py-6 mx-auto">
              <Champion sessionId={sessionId} round={round} difficulty={difficulty} answerOptions={answerOptions} answered={answered} wasUserCorrect={wasUserCorrect} />
            </div>
            <div className="py-6 items-center">
              <div className="grid grid-cols-2">
                <div className="score-title text-left uppercase">
                  Score: {parseInt(score)} / 10
                </div>
                <div className="score-title uppercase">
                  {formatElapsedTime(elapsedMs)}
                </div>
              </div>


              <div className="grid grid-cols-1 md:grid-cols-2">
                {answered ? "" : renderAnswerButtons(answerOptions, selectedAnswer, onAnswerClick)}
              </div>
              <div className={`right-answer ${wasUserCorrect && answered ? "correct" : ""}`}>
                <img src={resultGifUrl} alt="Correct reaction GIF" />
                <Button id="nextRound" buttonValue={round >= 10 ? "See results" : "Next round"} onClick={onNextRound} />
              </div>
              <div className={`wrong-answer ${!wasUserCorrect && answered ? "incorrect" : ""}`}>
                <img src={resultGifUrl} alt="Incorrect reaction GIF" />
                <Button id="nextRound" buttonValue={round >= 10 ? "See results" : "Next round"} onClick={onNextRound} />
              </div>

              <div className="flex-row">
                <div className="score-title text-left uppercase">
                  Round: {parseInt(round)} / 10
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default QuizScreen;
