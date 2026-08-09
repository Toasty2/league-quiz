import React from 'react';
import Confetti from 'canvas-confetti';
import logo from './logo.svg';
//import Riot from './apis/riot';
import Champion from './components/champion';
import Button from './components/button';
import HeaderBar from './components/headerBar';
import Stopwatch from './components/stopwatch';
import { getChampionNames } from './apis/ddragon';

import './App.css';
import './league.css';
//import 'bootstrap/dist/css/bootstrap.min.css'

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

    this.state = { correctAnswer: '', score: 0, round: 0, loading: true };
  }

  componentDidMount = () => {
    getChampionNames().then(champNames => {
      this.champNames = champNames;
      var correctChamp = this.getRandomChamp();

      this.setState({ correctAnswer: correctChamp, loading: false });
    });
  }


  onAnswerClick = (onClick) => {
    (onClick == this.state.correctAnswer) ? this.handleCorrectAnswer(onClick) : this.handleIncorrectAnswer();
    console.log('Correct answer is ' + this.state.correctAnswer + ' User selected ' + onClick + ' score is ' + this.state.score);
  }

  handleCorrectAnswer = (onClick) => {
    var newScore = this.state.score + 1;
    var newRound = this.state.round + 1;

    this.setState({ 
      wasUserCorrect: true,
      answered: true,
      onClick: onClick,
      score: newScore,
      round: newRound
    });
  }

  handleIncorrectAnswer = () => {
    var newRound = this.state.round + 1;

    this.setState({ 
      wasUserCorrect: false,
      answered: true,
      round: newRound
    });
  }

  getRandomChamp = (amount = 1) => {
    var champList = [];
    for (var i = 1; i <= amount; i++) {
      var random = Math.floor(Math.random() * this.champNames.length);
      //console.log('random is ' + random);
      champList.push(this.champNames[random]);
    }

    return champList;
  }

  getRandomAnswers = (amount = 3) => {
    var answers = this.getRandomChamp(amount);
    // Slot in the correct answer
    answers.push(this.state.correctAnswer.toString());
    // Randomise the array
    this.shuffleArray(answers);

    var buttons = [];
    console.log(answers);

    for (let i = 0; i < answers.length; i++) {
      var champ = answers[i];
        // note: we are adding a key prop here to allow react to uniquely identify each
        // element in this array. see: https://reactjs.org/docs/lists-and-keys.html
        buttons.push(<div className="p-6">
          <Button id={champ} key={champ} buttonValue={champ} onClick={this.onAnswerClick} className={`${this.state.onClick == {champ} ? "button-correct answer" : "answer"}`} />
        </div>);
    }

    return buttons;
  }

  runNextRound = () => {
    var correctChamp = this.getRandomChamp();
    console.log('running next round. Champ is ' + correctChamp[0]);

    this.setState({ 
      correctAnswer: correctChamp,
      answered: false,
      wasUserCorrect: false,
      champName: correctChamp
    });
  }

  resetQuiz = () => {
    window.location.reload();
  }

  /* Randomize array in-place using Durstenfeld shuffle algorithm - https://stackoverflow.com/a/12646864 */
  shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
  }

  render() {
    //console.log('champ is ' + this.state.correctAnswer);

    if (this.state.loading) {
      return (
        <div className="App">Loading champions...</div>
      );
    }

    if (this.state.round >= 10) {
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
                  <Champion champName={this.state.correctAnswer} />
                </div>
                <div className="py-6 items-center">
                  <div className="grid grid-cols-2">
                    <div className="score-title text-left uppercase">
                      Score: {parseInt(this.state.score)} / 10
                    </div>
                    <div className="score-title uppercase">
                      Timer
                    </div>
                  </div>

                  
                  <div className="grid grid-cols-1 md:grid-cols-2">
                    {this.state.answered ? "" : this.getRandomAnswers(3)}
                  </div>
                  <div className={`right-answer ${this.state.wasUserCorrect && this.state.answered ? "correct" : ""}`}>
                    <img src="https://media0.giphy.com/media/3o7abKhOpu0NwenH3O/200w.webp?cid=ecf05e4790561tdhsbjxemeoujg2i7ir9nykpleg3zs15i0w&rid=200w.webp&ct=g" />
                    <Button id="nextRound" buttonValue="Next round" onClick = {this.runNextRound} />
                  </div>
                  <div className={`wrong-answer ${!this.state.wasUserCorrect && this.state.answered ? "incorrect" : ""}`}>
                    <img src="https://c.tenor.com/zIm8X37R8cIAAAAC/b99-chelsea-peretti.gif" />
                    <Button id="nextRound" buttonValue="Next round" onClick = {this.runNextRound} />
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
