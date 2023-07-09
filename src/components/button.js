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
                <button 
                    type="button"
                    className={`button answer-button relative text-center ${classes}`}
                    onClick={this.onClick}
                    value={this.state.buttonValue}
                >
                    <img src={require('../assets/img/button_border.png')} alt="" className="absolute -top-1.5 left-0" />
                    {buttonText}
                </button>   
        );
    }
}

export default Button;