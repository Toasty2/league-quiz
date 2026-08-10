import React from 'react';
import Confetti from 'canvas-confetti';
//import logo from './logo.svg';
//import Riot from './apis/riot';
import Champion from './components/champion';
import Button from './components/button';
//import HeaderBar from './components/headerBar';
//import Stopwatch from './components/stopwatch';
import { preloadImage } from './apis/ddragon';
import { fetchGifPool } from './apis/giphy';
import { startQuizSession, beginSession, checkAnswer, submitQuiz, getSplashProxyUrl } from './apis/supabase';

import './App.css';
import './league.css';
//import 'bootstrap/dist/css/bootstrap.min.css'

const DEFAULT_CORRECT_GIF = 'https://media0.giphy.com/media/3o7abKhOpu0NwenH3O/200w.webp?cid=ecf05e4790561tdhsbjxemeoujg2i7ir9nykpleg3zs15i0w&rid=200w.webp&ct=g';
const DEFAULT_INCORRECT_GIF = 'https://c.tenor.com/zIm8X37R8cIAAAAC/b99-chelsea-peretti.gif';

class App extends React.Component {
  state = {
    onClick: '',
    wasUserCorrect: '',
    answered: false,
    correctAnswer: '',
    score: 0,
    round: 0
  };

  constructor(props) {
    super(props);

    this.state = {
      sessionId: null,
      questions: [],
      answerOptions: [],
      onClick: '',
      wasUserCorrect: '',
      answered: false,
      checking: false,
      score: 0,
      round: 0,
      loading: true,
      started: false,
      preparingQuiz: false,
      readyToSubmit: false,
      playerName: '',
      submitting: false,
      finished: false,
      finalScore: null,
      elapsedMs: 0,
      correctGifPool: [DEFAULT_CORRECT_GIF],
      incorrectGifPool: [DEFAULT_INCORRECT_GIF],
      resultGifUrl: DEFAULT_CORRECT_GIF
    };
  }

  componentWillUnmount = () => {
    this.stopTimer();
  }

  startQuiz = () => {
    if (this.state.preparingQuiz || this.state.started) {
      return;
    }

    this.setState({ preparingQuiz: true });

    this.sessionPromise.then(({ sessionId, questions }) => {
      var preloads = questions.map((question, round) => preloadImage(getSplashProxyUrl(sessionId, round)));

      return Promise.all(preloads)
        .then(() => beginSession(sessionId))
        .then(() => {
          this.setState({
            sessionId: sessionId,
            questions: questions,
            answerOptions: questions[0].options,
            started: true,
            preparingQuiz: false
          });
          this.startTimer();
        });
    });
  }

  startTimer = () => {
    var startTime = Date.now();

    this.timerInterval = setInterval(() => {
      this.setState({ elapsedMs: Date.now() - startTime });
    }, 100);
  }

  stopTimer = () => {
    clearInterval(this.timerInterval);
  }

  formatElapsedTime = (totalMs) => {
    var totalSeconds = Math.floor(totalMs / 1000);
    var minutes = Math.floor(totalSeconds / 60);
    var seconds = totalSeconds % 60;
    var milliseconds = totalMs % 1000;
    return `${minutes}:${String(seconds).padStart(2, '0')}.${String(milliseconds).padStart(3, '0')}`;
  }

  componentDidMount = () => {
    this.sessionPromise = startQuizSession();
    this.sessionPromise.then(() => {
      this.setState({ loading: false });
    });

    fetchGifPool('correct').then(gifs => {
      if (gifs.length > 0) {
        this.setState(prevState => ({
          correctGifPool: [...prevState.correctGifPool, ...gifs]
        }));
      }
    });

    fetchGifPool('incorrect').then(gifs => {
      if (gifs.length > 0) {
        this.setState(prevState => ({
          incorrectGifPool: [...prevState.incorrectGifPool, ...gifs]
        }));
      }
    });
  }

  componentDidUpdate = (prevProps, prevState) => {
    if (this.state.finished && !prevState.finished) {
      this.celebrateWin();
    }
  }

  celebrateWin = () => {
    var myCanvas = document.createElement('canvas');
    myCanvas.className = 'confetti-bg';
    document.body.appendChild(myCanvas);

    var myConfetti = Confetti.create(myCanvas, {
      resize: true,
      useWorker: true
    });

    // do this for 1.5 seconds
    var duration = 1.5 * 1000;
    var end = Date.now() + duration;

    (function frame() {
      // launch a few confetti from the left edge
      myConfetti({
        particleCount: 7,
        angle: 60,
        spread: 55,
        origin: { x: 0 }
      });
      // and launch a few from the right edge
      myConfetti({
        particleCount: 7,
        angle: 120,
        spread: 55,
        origin: { x: 1 }
      });

      // keep going until we are out of time
      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    }());
  }


  onAnswerClick = (selected) => {
    if (this.state.checking || this.state.answered) {
      return;
    }

    this.setState({ checking: true });

    checkAnswer(this.state.sessionId, this.state.round, selected).then(({ correct }) => {
      this.setState({ checking: false });
      correct ? this.handleCorrectAnswer(selected) : this.handleIncorrectAnswer();
    });
  }

  // Picks a GIF from an already-fetched pool. Called once per round, at the
  // same time the round's outcome is decided (handleCorrectAnswer / handleIncorrectAnswer)
  pickRandomGif = (pool) => {
    var randomIndex = Math.floor(Math.random() * pool.length);
    return pool[randomIndex];
  }

  handleCorrectAnswer = (onClick) => {
    var newScore = this.state.score + 1;
    var newRound = this.state.round + 1;

    if (newRound >= 10) {
      this.stopTimer();
    }

    this.setState({
      wasUserCorrect: true,
      answered: true,
      onClick: onClick,
      score: newScore,
      round: newRound,
      resultGifUrl: this.pickRandomGif(this.state.correctGifPool)
    });
  }

  handleIncorrectAnswer = () => {
    var newRound = this.state.round + 1;

    if (newRound >= 10) {
      this.stopTimer();
    }

    this.setState({
      wasUserCorrect: false,
      answered: true,
      round: newRound,
      resultGifUrl: this.pickRandomGif(this.state.incorrectGifPool)
    });
  }

  renderAnswerButtons = () => {
    var buttons = [];

    for (let i = 0; i < this.state.answerOptions.length; i++) {
      var champ = this.state.answerOptions[i];
        // note: we are adding a key prop here to allow react to uniquely identify each
        // element in this array. see: https://reactjs.org/docs/lists-and-keys.html
        buttons.push(<div className="p-6">
          <Button id={champ} key={champ} buttonValue={champ} onClick={this.onAnswerClick} className={`${this.state.onClick === champ ? "button-correct answer" : "answer"}`} />
        </div>);
    }

    return buttons;
  }

  runNextRound = () => {
    if (this.state.round >= 10) {
      this.setState({ readyToSubmit: true });
      return;
    }

    var nextQuestion = this.state.questions[this.state.round];

    this.setState({
      answerOptions: nextQuestion.options,
      answered: false,
      wasUserCorrect: false
    });
  }

  updatePlayerName = (event) => {
    this.setState({ playerName: event.target.value });
  }

  submitScore = () => {
    if (this.state.submitting || !this.state.playerName.trim()) {
      return;
    }

    this.setState({ submitting: true });

    submitQuiz(this.state.sessionId, this.state.playerName.trim()).then(result => {
      this.setState({
        finished: true,
        submitting: false,
        finalScore: result.finalScore
      });
    });
  }

  resetQuiz = () => {
    window.location.reload();
  }

  render() {
    if (this.state.loading) {
      return (
        <div className="App">Loading champions...</div>
      );
    }

    if (!this.state.started) {
      return (
        <div className="App">
          <div className="container-bg">
            <main className="app-container">
              <div className="start-screen">
                <h1 className="question-title">League of Legends Quiz</h1>
                <Button id="startQuiz" buttonValue={this.state.preparingQuiz ? "Preparing..." : "Start"} onClick={this.startQuiz} />
              </div>
            </main>
          </div>
        </div>
      );
    }

    if (this.state.readyToSubmit && !this.state.finished) {
      return (
        <div className="App">
          <div className="container-bg">
            <main className="app-container">
              <div className="start-screen">
                <h1 className="question-title">Enter your name</h1>
                <input type="text" value={this.state.playerName} onChange={this.updatePlayerName} maxLength={30} />
                <Button id="submitScore" buttonValue={this.state.submitting ? "Submitting..." : "Submit score"} onClick={this.submitScore} />
              </div>
            </main>
          </div>
        </div>
      );
    }

    if (this.state.finished) {
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


      return (
        <div id="app" className="App">
          <div className="container-bg">
            <div className="app-container">
                <div className="row">
                  <div className="col-12">
                    <h1 className="score-title">{parseInt(this.state.score)} / 10</h1>
                    <h1 className="score-title">{scoreText[parseInt(this.state.score)]}</h1>
                    <h1 className="score-title">Final Score: {this.state.finalScore}</h1>
                    <button onClick={this.resetQuiz}>Reset</button>
                  </div>
                </div>
            </div>
          </div>

        </div>
      );
    }
    else {
      return (
        <div className="App">
          <div className="container-bg">
            <main className="app-container">
              <div className="grid grid-cols-1 md:grid-cols-2 items-center">
                <div className="py-6 mx-auto">
                  <Champion sessionId={this.state.sessionId} round={this.state.round} answerOptions={this.state.answerOptions} answered={this.state.answered} wasUserCorrect={this.state.wasUserCorrect} />
                </div>
                <div className="py-6 items-center">
                  <div className="grid grid-cols-2">
                    <div className="score-title text-left uppercase">
                      Score: {parseInt(this.state.score)} / 10
                    </div>
                    <div className="score-title uppercase">
                      {this.formatElapsedTime(this.state.elapsedMs)}
                    </div>
                  </div>


                  <div className="grid grid-cols-1 md:grid-cols-2">
                    {this.state.answered ? "" : this.renderAnswerButtons()}
                  </div>
                  <div className={`right-answer ${this.state.wasUserCorrect && this.state.answered ? "correct" : ""}`}>
                    <img src={this.state.resultGifUrl} alt="Correct reaction GIF" />
                    <Button id="nextRound" buttonValue={this.state.round >= 10 ? "See results" : "Next round"} onClick = {this.runNextRound} />
                  </div>
                  <div className={`wrong-answer ${!this.state.wasUserCorrect && this.state.answered ? "incorrect" : ""}`}>
                    <img src={this.state.resultGifUrl} alt="Incorrect reaction GIF" />
                    <Button id="nextRound" buttonValue={this.state.round >= 10 ? "See results" : "Next round"} onClick = {this.runNextRound} />
                  </div>

                  <div className="flex-row">
                    <div className="score-title text-left uppercase">
                      Round: {parseInt(this.state.round)} / 10
                    </div>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
      );
    }
  }
}

export default App;
