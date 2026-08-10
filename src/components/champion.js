import React from 'react';
import { getSplashProxyUrl } from '../apis/supabase';

class Champion extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            // The card has exactly two physical faces. Rather than fixing
            // "front = card back, back = splash art", each face just holds
            // whatever content was placed there most recently, and every
            // transition updates the currently-hidden face then flips to it -
            // a ping-pong, so the same two faces can keep cycling through
            // card-back -> splash -> result -> next splash -> next result...
            flipped: false,
            frontContent: { type: 'cardback' },
            backContent: null
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
        this.flipToShow({ type: 'splash', proxyUrl: getSplashProxyUrl(this.props.sessionId, round) });
    }

    showResult = (wasUserCorrect) => {
        this.flipToShow({ type: 'result', correct: wasUserCorrect });
    }

    componentDidMount = () => {
        this.loadChamp(this.props.round);
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
            this.showResult(this.props.wasUserCorrect);
        }
    }

    renderFace = (content) => {
        if (!content) {
            return null;
        }

        if (content.type === 'cardback') {
            return <img src={require('../assets/img/card.png')} alt="Face-down champion card" className="flip-card-plain-image" />;
        }

        if (content.type === 'result') {
            var resultImage = content.correct ? require('../assets/img/card_correct.png') : require('../assets/img/card_incorrect.png');
            var resultAlt = content.correct ? 'Correct answer' : 'Incorrect answer';
            return <img src={resultImage} alt={resultAlt} className="flip-card-plain-image" />;
        }

        if (content.type === 'splash') {
            return (
                <div className="ui relaxed divided list test champion-splash relative">
                    <img src={require('../assets/img/champ_border.png')} alt="" className="absolute pl-4 pt-4 -top-0.5 champion-border" />
                    <img src={content.proxyUrl} alt="Champion splash art" className="champion-splash-art" />
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
