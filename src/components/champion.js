import React from 'react';
import { getSplashProxyUrl } from '../apis/supabase';
import { getTechniqueForRound, getRevealDuration, buildChallengerSequence } from './obfuscation';

class Champion extends React.Component {

    constructor(props) {
        super(props);

        // Challenger plays each technique twice in a shuffled order rather
        // than a fixed cycle - generated once per game, not per round.
        this.challengerSequence = props.difficulty === 'challenger' ? buildChallengerSequence() : null;

        this.state = {
            // The card has exactly two physical faces. Rather than fixing
            // "front = card back, back = splash art", each face just holds
            // whatever content was placed there most recently, and every
            // transition updates the currently-hidden face then flips to it -
            // a ping-pong, so the same two faces can keep cycling through
            // card-back -> splash -> result -> next splash -> next result...
            flipped: false,
            frontContent: { type: 'cardback' },
            backContent: null,
            revealProgress: 1
        };
    }

    // Old way using fetch
    /*fetchChamp = (champName, champDataSource) => {
        this.setState({ loading: true });
        fetch(champDataSource)
        .then(async response => {
            const data = await response.json();

            // check for error response
            if (!response.ok) {
                // get error message from body or default to response statusText
                const error = (data && data.message) || response.statusText;
                return Promise.reject(error);
            }

            console.log(data);

            this.setState({
                champData: data,
                loading: false,
            });
        })
        .catch(error => {
            this.setState({ errorMessage: error.toString(), loading: false });
            console.error('There was an error!', error);
        });
    }*/

    // Puts new content on whichever face isn't currently showing, then flips
    // to it a moment later - the small delay guarantees a paint happens with
    // the old face still visible, so the CSS transition has something to
    // animate from. The target state is computed once, up front, from
    // this.state.flipped at call time - not via a toggle relative to
    // whatever state exists whenever the delayed callback happens to fire -
    // so that if this is ever called twice in quick succession (e.g. mount
    // lifecycles firing more than once), both calls converge on the same
    // result instead of toggling each other back and forth.
    flipToShow = (content) => {
        var hiddenFaceKey = this.state.flipped ? 'frontContent' : 'backContent';
        var targetFlipped = !this.state.flipped;

        this.setState({ [hiddenFaceKey]: content });

        setTimeout(() => {
            this.setState({ flipped: targetFlipped });
        }, 30);
    }

    loadChamp = (round) => {
        this.stopReveal();
        this.activeRound = round;

        var technique = null;
        if (this.props.difficulty === 'hard') {
            technique = getTechniqueForRound(round);
        } else if (this.props.difficulty === 'challenger') {
            technique = this.challengerSequence[round];
        }

        this.flipToShow({ type: 'splash', proxyUrl: getSplashProxyUrl(this.props.sessionId, round), technique });

        if (technique) {
            this.startReveal(technique);
        }
    }

    startReveal = (technique) => {
        var startTime = Date.now();
        var durationMs = getRevealDuration(technique);
        this.setState({ revealProgress: 0 });

        this.revealInterval = setInterval(() => {
            var progress = Math.min(1, (Date.now() - startTime) / durationMs);
            this.setState({ revealProgress: progress });

            if (progress >= 1) {
                this.stopReveal();
            }
        }, 100);
    }

    stopReveal = () => {
        clearInterval(this.revealInterval);
    }

    showResult = () => {
        this.stopReveal();
        this.flipToShow({ type: 'splash', proxyUrl: getSplashProxyUrl(this.props.sessionId, this.activeRound), technique: null });
    }

    componentDidMount = () => {
        this.loadChamp(this.props.round);
    }

    componentWillUnmount = () => {
        this.stopReveal();
    }

    componentDidUpdate = (prevProps, prevState) => {
        /*var champName = this.state.champName;
        var oldChamp = prevState.champName;
        console.log('champion from champion.js didupdate is ' + champName + ' and old champ is ' + oldChamp);
        //if (oldChamp != champName ) {
            const champDataSource = `http://ddragon.leagueoflegends.com/cdn/12.16.1/data/en_US/champion/${champName}.json`;

            this.fetchChamp(champDataSource);
        //}*/
        //this.setState({ champName: this.state.champName });

        if (prevProps.answerOptions !== this.props.answerOptions) {
            this.loadChamp(this.props.round);
        } else if (!prevProps.answered && this.props.answered) {
            this.showResult();
        }
    }

    renderFace = (content) => {
        if (!content) {
            return null;
        }

        if (content.type === 'cardback') {
            return <img src={require('../assets/img/card.png')} alt="Face-down champion card" className="flip-card-plain-image" />;
        }

        if (content.type === 'splash') {
            var Technique = content.technique;
            var spinClass = (this.props.difficulty === 'challenger' && Technique) ? ' champion-splash-spin' : '';
            return (
                <div className={`ui relaxed divided list test champion-splash relative${spinClass}`}>
                    <img src={require('../assets/img/champ_border.png')} alt="" className="absolute pl-4 pt-4 -top-0.5 champion-border" />
                    {/* No fallback: preloadTechniques means this never actually suspends. */}
                    {Technique
                        ? (
                            <React.Suspense>
                                <Technique
                                    proxyUrl={content.proxyUrl}
                                    alt="Champion splash art"
                                    className="champion-splash-art"
                                    progress={this.state.revealProgress}
                                />
                            </React.Suspense>
                          )
                        : <img src={content.proxyUrl} alt="Champion splash art" className="champion-splash-art" />}
                </div>
            );
        }

        return null;
    }

    render() {
        return (
            <div className="flip-card">
                <div className={`flip-card-inner ${this.state.flipped ? 'flipped' : ''}`}>
                    <div className="flip-card-front">
                        {this.renderFace(this.state.frontContent)}
                    </div>
                    <div className="flip-card-back">
                        {this.renderFace(this.state.backContent)}
                    </div>
                </div>
            </div>
        );
    }
}

export default Champion;
