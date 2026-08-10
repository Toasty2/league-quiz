import React from 'react';
import { isMuted, toggleMute } from '../apis/sound';

class MuteToggle extends React.Component {
  state = { muted: isMuted() };

  handleClick = () => {
    this.setState({ muted: toggleMute() });
  }

  render() {
    return (
      <button className="mute-toggle" onClick={this.handleClick}>
        {this.state.muted ? 'Unmute' : 'Mute'}
      </button>
    );
  }
}

export default MuteToggle;
