import React from 'react';
import Button from './button';

class Answer extends React.Component {
    
    constructor(props) {
        super(props);

        this.state = { 
            answers: [],
            correctAnswer: props.champName,
        };
    }

    render() {
        return (
            <div>Answer</div>
        );
    }
}

export default Answer;