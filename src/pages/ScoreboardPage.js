import React from 'react';
import { Link } from 'react-router-dom';
import { getLeaderboard } from '../apis/supabase';

class ScoreboardPage extends React.Component {
  state = {
    scores: [],
    loading: true
  };

  highlightedRowRef = null;

  componentDidMount = () => {
    this.fetchScores();
  }

  componentDidUpdate = (prevProps, prevState) => {
    if (prevProps.difficulty !== this.props.difficulty) {
      this.setState({ loading: true });
      this.fetchScores();
    }

    if (prevState.loading && !this.state.loading) {
      this.scrollToHighlightedRow();
    }
  }

  fetchScores = () => {
    // Fetch enough rows to guarantee the just-submitted score is present,
    // rather than the normal top-20 browsing limit.
    var limit = this.props.highlightSessionId ? 100 : 20;

    getLeaderboard(this.props.difficulty, limit).then(scores => {
      this.setState({ scores, loading: false });
    });
  }

  scrollToHighlightedRow = () => {
    if (this.highlightedRowRef) {
      this.highlightedRowRef.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }

  render() {
    return (
      <div className="App">
        <div className="container-bg">
          <main className="app-container scoreboard-screen">
            <h1 className="question-title">Scoreboard</h1>

            <div className="difficulty-tabs">
              <Link
                to="/scoreboard?difficulty=easy"
                className={`score-title ${this.props.difficulty === 'easy' ? 'difficulty-tab-active' : ''}`}
              >
                Baby Mode
              </Link>
              <Link
                to="/scoreboard?difficulty=hard"
                className={`score-title ${this.props.difficulty === 'hard' ? 'difficulty-tab-active' : ''}`}
              >
                Hard Mode
              </Link>
              <Link
                to="/scoreboard?difficulty=challenger"
                className={`score-title ${this.props.difficulty === 'challenger' ? 'difficulty-tab-active' : ''}`}
              >
                Challenger
              </Link>
            </div>

            {this.state.loading ? (
              <p className="score-title">Loading scoreboard...</p>
            ) : (
              <table className="mx-auto">
                <thead>
                  <tr>
                    <th className="score-title px-2 md:px-6">Name</th>
                    <th className="score-title px-2 md:px-6">Score</th>
                    <th className="score-title px-2 md:px-6">Correct</th>
                    <th className="score-title px-2 md:px-6">Time</th>
                  </tr>
                </thead>
                <tbody>
                  {this.state.scores.map((score, i) => {
                    var isMine = score.session_id === this.props.highlightSessionId;
                    return (
                      <tr
                        key={i}
                        ref={isMine ? (el => { this.highlightedRowRef = el; }) : null}
                        className={isMine ? 'score-row-highlight' : ''}
                      >
                        <td className="score-title px-2 md:px-6">{score.player_name}</td>
                        <td className="score-title px-2 md:px-6">{score.final_score}</td>
                        <td className="score-title px-2 md:px-6">{score.correct_count} / 10</td>
                        <td className="score-title px-2 md:px-6">{(score.elapsed_ms / 1000).toFixed(3)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}

            <Link to="/" className="button answer-button relative text-center inline-block">
              <img src={require('../assets/img/button_border.png')} alt="" className="absolute -top-1.5 left-1/2 -translate-x-1/2" />
              Back to quiz
            </Link>
          </main>
        </div>
      </div>
    );
  }
}

export default ScoreboardPage;
