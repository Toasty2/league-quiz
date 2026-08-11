import React from 'react';
// import { playSfx } from '../apis/sound';

class Button extends React.Component {
    onClick = (e) => {
        e.preventDefault();

        // if (this.props.playAudio) {
        //     playSfx('buttonPress');
        // }

        this.props.onClick(this.props.buttonValue);
    }

    render() {
        var buttonValue = this.props.buttonValue;
        var classes = this.props.className || '';
        var disabled = !!this.props.disabled;

        return (
                <button
                    type="button"
                    className={`button answer-button relative text-center ${disabled ? 'button-disabled' : ''} ${classes}`}
                    onClick={this.onClick}
                    value={buttonValue}
                    disabled={disabled}
                >
                    <img src={require('../assets/img/button_border.png')} alt="" className="absolute -top-1.5 left-1/2 -translate-x-1/2" />
                    {buttonValue}
                </button>
        );
    }
}

export default Button;