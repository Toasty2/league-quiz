import React from 'react';
import Confetti from 'canvas-confetti';
//import logo from '../logo.svg';
//import Riot from '../apis/riot';
//import HeaderBar from '../components/headerBar';
//import Stopwatch from '../components/stopwatch';
import { preloadImage } from '../apis/ddragon';
import { fetchGifPool } from '../apis/giphy';
import { startQuizSession, setDifficulty, beginSession, checkAnswer, submitQuiz, getSplashProxyUrl } from '../apis/supabase';
import { startMusic } from '../apis/sound';
import LoadingScreen from '../components/screens/LoadingScreen';
import StartScreen from '../components/screens/StartScreen';
import SubmitScoreScreen from '../components/screens/SubmitScoreScreen';
import QuizScreen from '../components/screens/QuizScreen';

const DEFAULT_CORRECT_GIF = 'https://media0.giphy.com/media/3o7abKhOpu0NwenH3O/200w.webp?cid=ecf05e4790561tdhsbjxemeoujg2i7ir9nykpleg3zs15i0w&rid=200w.webp&ct=g';
const DEFAULT_INCORRECT_GIF = 'https://c.tenor.com/zIm8X37R8cIAAAAC/b99-chelsea-peretti.gif';

class QuizPage extends React.Component {
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
      difficulty: null,
      readyToSubmit: false,
      playerName: '',
      submitting: false,
      elapsedMs: 0,
      correctGifPool: [DEFAULT_CORRECT_GIF],
      incorrectGifPool: [DEFAULT_INCORRECT_GIF],
      resultGifUrl: DEFAULT_CORRECT_GIF
    };
  }

  componentWillUnmount = () => {
    this.stopTimer();
  }

  startQuiz = (difficulty) => {
    if (this.state.preparingQuiz || this.state.started) {
      return;
    }

    this.setState({ preparingQuiz: true, difficulty });
    startMusic();

    this.sessionPromise.then(({ sessionId, questions }) => {
      return setDifficulty(sessionId, difficulty)
        .then(() => {
          var preloads = questions.map((question, round) => preloadImage(getSplashProxyUrl(sessionId, round)));
          return Promise.all(preloads);
        })
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
    if (this.state.readyToSubmit && !prevState.readyToSubmit) {
      this.celebrateWin(this.state.score);
    }
  }

  celebrateWin = (score) => {
    if (score <= 0) {
      return;
    }

    var myCanvas = document.createElement('canvas');
    myCanvas.className = 'confetti-bg';
    document.body.appendChild(myCanvas);

    var myConfetti = Confetti.create(myCanvas, {
      resize: true,
      useWorker: true
    });

    // Scales linearly with correct answers - 7 (the original amount) at a
    // perfect score, down to nothing at 0.
    var particleCount = Math.round(7 * (score / 10));

    // do this for 1.5 seconds
    var duration = 1.5 * 1000;
    var end = Date.now() + duration;

    (function frame() {
      // launch a few confetti from the left edge
      myConfetti({
        particleCount: particleCount,
        angle: 60,
        spread: 55,
        origin: { x: 0 }
      });
      // and launch a few from the right edge
      myConfetti({
        particleCount: particleCount,
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

    submitQuiz(this.state.sessionId, this.state.playerName.trim()).then(() => {
      this.props.navigate(`/scoreboard?difficulty=${this.state.difficulty}`, {
        state: { sessionId: this.state.sessionId }
      });
    });
  }

  render() {
    if (this.state.loading) {
      return <LoadingScreen />;
    }

    if (!this.state.started) {
      return (
        <StartScreen
          preparingQuiz={this.state.preparingQuiz}
          pendingDifficulty={this.state.difficulty}
          onStart={this.startQuiz}
        />
      );
    }

    if (this.state.readyToSubmit) {
      return (
        <SubmitScoreScreen
          score={this.state.score}
          playerName={this.state.playerName}
          submitting={this.state.submitting}
          onNameChange={this.updatePlayerName}
          onSubmit={this.submitScore}
        />
      );
    }

    return (
      <QuizScreen
        sessionId={this.state.sessionId}
        round={this.state.round}
        difficulty={this.state.difficulty}
        answerOptions={this.state.answerOptions}
        answered={this.state.answered}
        wasUserCorrect={this.state.wasUserCorrect}
        selectedAnswer={this.state.onClick}
        score={this.state.score}
        elapsedMs={this.state.elapsedMs}
        resultGifUrl={this.state.resultGifUrl}
        onAnswerClick={this.onAnswerClick}
        onNextRound={this.runNextRound}
      />
    );
  }
}

export default QuizPage;
