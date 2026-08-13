import React from 'react';
//import logo from '../logo.svg';
//import Riot from '../apis/riot';
//import HeaderBar from '../components/headerBar';
//import Stopwatch from '../components/stopwatch';
import { preloadImage } from '../apis/ddragon';
import { preloadTechniques } from '../components/obfuscation';
import { startQuizSession, setDifficulty, beginSession, checkAnswer, submitQuiz, getSplashProxyUrl } from '../apis/supabase';
import StartScreen from '../components/screens/StartScreen';
import SubmitScoreScreen from '../components/screens/SubmitScoreScreen';
import QuizScreen from '../components/screens/QuizScreen';

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
      checkingAnswer: null,
      correctChampName: null,
      score: 0,
      round: 0,
      started: false,
      preparingQuiz: false,
      difficulty: null,
      readyToSubmit: false,
      playerName: '',
      submitting: false,
      elapsedMs: 0
    };
  }

  componentWillUnmount = () => {
    this.pauseTimer();
  }

  startQuiz = (difficulty) => {
    if (this.state.preparingQuiz || this.state.started) {
      return;
    }

    this.setState({ preparingQuiz: true, difficulty });

    this.sessionPromise.then(({ sessionId, questions }) => {
      return setDifficulty(sessionId, difficulty)
        .then(() => {
          var imagePreloads = questions.map((question, round) => preloadImage(getSplashProxyUrl(sessionId, round)));
          return Promise.all([...imagePreloads, preloadTechniques(difficulty)]);
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
    }).catch(() => {
      this.setState({ preparingQuiz: false, difficulty: null });
    });
  }

  // Also doubles as resume: picks up from the current elapsedMs rather than
  // restarting the clock, so pauseTimer/startTimer can alternate freely.
  startTimer = () => {
    var resumeFrom = this.state.elapsedMs;
    var resumeTime = Date.now();

    this.timerInterval = setInterval(() => {
      this.setState({ elapsedMs: resumeFrom + (Date.now() - resumeTime) });
    }, 100);
  }

  pauseTimer = () => {
    clearInterval(this.timerInterval);
  }

  componentDidMount = () => {
    this.sessionPromise = startQuizSession();
  }

  componentDidUpdate = (prevProps, prevState) => {
    if (this.state.readyToSubmit && !prevState.readyToSubmit) {
      this.celebrateWin(this.state.score);
    }

    // The timer pauses the instant an answer is clicked (see onAnswerClick)
    // and only resumes once the next round has actually started, rather than
    // the instant "Next round" is clicked - so round setup time doesn't
    // count against the player
    if (prevState.answered && !this.state.answered) {
      this.startTimer();
    }
  }

  celebrateWin = (score) => {
    if (score <= 0) {
      return;
    }

    import('canvas-confetti').then(({ default: Confetti }) => {
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
    });
  }


  onAnswerClick = (selected) => {
    if (this.state.checking || this.state.answered) {
      return;
    }

    this.pauseTimer();
    this.setState({ checking: true, checkingAnswer: selected });

    checkAnswer(this.state.sessionId, this.state.round, selected).then(({ correct, correctChampName }) => {
      this.setState({ checking: false });
      correct ? this.handleCorrectAnswer(selected, correctChampName) : this.handleIncorrectAnswer(correctChampName);
    });
  }

  // Picks a GIF from an already-fetched pool. Called once per round, at the
  // same time the round's outcome is decided (handleCorrectAnswer / handleIncorrectAnswer)
  pickRandomGif = (pool) => {
    var randomIndex = Math.floor(Math.random() * pool.length);
    return pool[randomIndex];
  }

  handleCorrectAnswer = (onClick, correctChampName) => {
    var newScore = this.state.score + 1;
    var newRound = this.state.round + 1;

    this.setState({
      wasUserCorrect: true,
      answered: true,
      onClick: onClick,
      score: newScore,
      round: newRound,
      correctChampName: correctChampName
    });
  }

  handleIncorrectAnswer = (correctChampName) => {
    var newRound = this.state.round + 1;

    this.setState({
      wasUserCorrect: false,
      answered: true,
      round: newRound,
      correctChampName: correctChampName
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
      wasUserCorrect: false,
      checkingAnswer: null,
      correctChampName: null
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
          correctCount={this.state.score}
          elapsedMs={this.state.elapsedMs}
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
        checking={this.state.checking}
        checkingAnswer={this.state.checkingAnswer}
        correctChampName={this.state.correctChampName}
        score={this.state.score}
        elapsedMs={this.state.elapsedMs}
        onAnswerClick={this.onAnswerClick}
        onNextRound={this.runNextRound}
      />
    );
  }
}

export default QuizPage;
