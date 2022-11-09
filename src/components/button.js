import React from 'react';

class Button extends React.Component {
    constructor(props) {
        super(props);

        this.state = { 
            buttonText: '',
            buttonClass: '',
            buttonValue: props.buttonValue
        };
    }

    onClick = (e) => {
        e.preventDefault();
        this.props.onClick(this.state.buttonValue);
    }

    render() {
        var buttonText = this.state.buttonValue;
        var classes = this.state.buttonClass;

        return (
            <div>
                <button 
                    type="button"
                    className={`button ${classes}`}
                    onClick={this.onClick}
                    value={this.state.buttonValue}
                >
                    {buttonText}
                </button>
            </div>
        );
    }
}

export default Button;