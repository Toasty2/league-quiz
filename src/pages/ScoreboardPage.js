import React from 'react';
import { Link } from 'react-router-dom';
import { getLeaderboard } from '../apis/supabase';

class ScoreboardPage extends React.Component {
  state = {
    scores: [],
    loading: true
  };

  componentDidMount = () => {
    this.fetchScores();
  }

  componentDidUpdate = (prevProps) => {
    if (prevProps.difficulty !== this.props.difficulty) {
      this.setState({ loading: true });
      this.fetchScores();
    }
  }

  fetchScores = () => {
    getLeaderboard(this.props.difficulty).then(scores => {
      this.setState({ scores, loading: false });
    });
  }

  render() {
    if (this.state.loading) {
      return (
        <div className="App">Loading scoreboard...</div>
      );
    }

    return (
      <div className="App">
        <div className="container-bg">
          <main className="app-container">
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

            <table>
              <thead>
                <tr>
                  <th className="score-title">Name</th>
                  <th className="score-title">Score</th>
                  <th className="score-title">Correct</th>
                  <th className="score-title">Time</th>
                </tr>
              </thead>
              <tbody>
                {this.state.scores.map((score, i) => (
                  <tr key={i}>
                    <td className="score-title">{score.player_name}</td>
                    <td className="score-title">{score.final_score}</td>
                    <td className="score-title">{score.correct_count} / 10</td>
                    <td className="score-title">{(score.elapsed_ms / 1000).toFixed(3)}s</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <Link to="/" className="score-title">Back to quiz</Link>
          </main>
        </div>
      </div>
    );
  }
}

export default ScoreboardPage;
